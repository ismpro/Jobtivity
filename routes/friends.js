/**
 * @file Express router for handling friends related routes
 * @module routes/friends
 */

const router = require("express").Router();

const { body } = require('express-validator');

const Friend = require("../models/FriendModel");
const FriendRequest = require("../models/FriendRequestModel");
const User = require("../models/UserModel");

/**
 * @function
 * @middleware
 * @description Check if user is logged in and has a valid session
 */
const checkSession = async function (req, res, next) {
    if (req.session.userid) {
        next();
    } else {
        res.sendStatus(401);
    }
}

/**
 * @function
 * @description Get all friends for the current user
 * @param {Array} friends - An array of friends objects
 * @param {String} sameUserId - The id of the current user
 */
async function getFriends(friends, sameUserId) {

    if (!friends) {
        return [];
    }

    let ids = friends.map((friend) => {
        if (friend.professional1 === sameUserId) return friend.professional2;
        return friend.professional1;
    })

    let promises = [];

    for (const id of ids) {
        promises.push(User.getByProfessionalId(id));
    }

    let secondPromise = await Promise.all(promises);
    return secondPromise.map((userFriend) => {
        let friend = friends.find(friend => friend.professional1 === userFriend.professional
            || friend.professional2 === userFriend.professional);

        console.log(userFriend)
        return {
            id: friend.id,
            userid: userFriend.id,
            name: userFriend.name,
            email: userFriend.email,
            since: friend.since,
        }
    })
}

/**
 * @function
 * @description Get all friend requests for the current user
 * @param {Array} friendsRequests - An array of friends request objects
 */
async function getFriendsRequest(friendsRequests) {

    if (!friendsRequests) {
        return [];
    }

    let ids = friendsRequests.map((friend) => friend.professional1)

    let promises = [];

    for (const id of ids) {
        promises.push(User.getByProfessionalId(id));
    }

    let secondPromise = await Promise.all(promises);
    return secondPromise.map((userFriend) => {
        let friend = friendsRequests.find(friend => friend.professional1 === userFriend.professional);
        return {
            id: friend.id,
            name: userFriend.name,
            timestamp: friend.timestamp,
        }
    })
}

/**
 * @route {GET} /
 * @description Retrieve all friends and friend requests for the current user
 */
router.get('/', checkSession, async function (req, res) {

    let user = await User.getById(req.session.userid);

    if (user.isProfessional() || user.admin) {

        let [friendsUnpasred, friendsRequestsUnpasred] = await Promise.all([Friend.getAllForProfessional(user.professional), FriendRequest.getAllByProfessional2Id(user.professional)]);
        let [friends, friendsRequests] = await Promise.all([getFriends(friendsUnpasred, user.professional), getFriendsRequest(friendsRequestsUnpasred)]);

        res.status(200).send({
            friends,
            friendsRequests
        })
    } else {
        res.sendStatus(401);
    }
});

/**
 * @route {POST} /add
 * @description Send a friend request to a user with a specific email
 * @param {String} email - The email of the user to send the friend request to
 */
router.post('/add',
    checkSession,
    body('email').isEmail().withMessage('Please enter a valid email address'),
    global.checkForErrors,
    async function (req, res) {
        if (await User.existsByEmail(req.body.email)) {

            let [user1, user2] = await Promise.all([User.getById(req.session.userid), User.getByEmail(req.body.email)]);
            if (!(await FriendRequest.existsByProfessionalId(user2.professional))) {

                let request = new FriendRequest({ professional1: user1.professional, professional2: user2.professional, timestamp: new Date() });
                await request.create();

                res.status(200).send("Friend Request created");
            } else {
                res.status(216).send("Friend Request already send");
            }
        } else {
            res.status(210).send("This email doenst exists.");
        }
    });

/**
 * @route {POST} /request/:type
 * @description Handle accepting or declining a friend request
 * @param {String} type - The type of request (accept or decline)
 * @param {Number} id - The id of the friend request
 */
router.post('/request/:type',
    checkSession,
    body('id').isInt().withMessage('Please enter a valid id').toInt(),
    global.checkForErrors,
    async function (req, res) {
        let friendRequest = await FriendRequest.getById(req.body.id);

        if (req.params.type === 'accept') {

            let friend = new Friend({ professional1: friendRequest.professional1, professional2: friendRequest.professional2, since: new Date() });
            await friend.create();
        }

        await friendRequest.delete();

        res.status(200).send(true);
    });

/**
 * @route {GET} /search
 * @description Search for a user based on a search term
 * @param {String} text - The search term used to filter the results
 */
router.get('/search',
    checkSession,
    body('text').isString().withMessage('Please enter a valid text for the search').toLowerCase(),
    async function (req, res) {
        let text = req.query.s;

        if (text) {
            let users = await User.getProfessionalsBySearchEmailAndName(text);
            if (!users) users = [];
            res.status(200).send(users.map(user => ({ email: user.email, name: user.name })).filter(user => user.email !== req.session.email));
        } else {
            res.sendStatus(400);
        }
    })


/**
 * @route {DELETE} /:id
 * @middleware
 * @description Handle deleting a friend
 * @param {Number} id - The id of the friend
 */
router.delete('/remove',
    checkSession,
    body('id').isInt().withMessage('Please enter a valid id').toInt(),
    global.checkForErrors,
    async function (req, res) {
        try {
            let friend = await Friend.getById(req.body.id);
            await friend.delete()
            res.sendStatus(200);
        } catch (error) {
            console.log(error)
            res.sendStatus(500);
        }
    })

module.exports = router;