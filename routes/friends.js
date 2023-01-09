const router = require("express").Router();

const Friends = require("../models/FriendModel");
const FriendRequest = require("../models/FriendRequestModel");
const User = require("../models/UserModel");
const FriendsRequests = require("../models/FriendRequestModel");

async function getFriends(friends, sameUserId) {

    if(!friends) {
        return [];
    }

    let ids = friends.map((friend) => {
        if (friend.profissional1 === sameUserId) return friend.profissional2;
        return friend.profissional1;
    })

    let promises = [];

    for (const id of ids) {
        promises.push(User.getByProfessionalId(id));
    }

    let secondPromise = await Promise.all(promises);
    return secondPromise.map((userFriend) => {
        let friend = friends.find(friend => friend.profissional1 === userFriend.profissional
            || friend.profissional2 === userFriend.profissional)
        return {
            id: friend.id,
            userid: userFriend.id,
            name: userFriend.name,
            since: friend.since,
        }
    })
}

async function getFriendsRequest(friendsRequests, sameUserId) {

    if(!friendsRequests) {
        return [];
    }

    let ids = friendsRequests.map((friend) => friend.profissional1)

    let promises = [];

    for (const id of ids) {
        promises.push(User.getByProfessionalId(id));
    }

    let secondPromise = await Promise.all(promises);
    return secondPromise.map((userFriend) => {
        let friend = friendsRequests.find(friend => friend.profissional1 === userFriend.profissional);
        return {
            id: friend.id,
            name: userFriend.name,
            timestamp: friend.timestamp,
        }
    })
}

router.get('/', async function (req, res) {
    if (req.session.userid) {
        let user = await User.getById(req.session.userid);

        if (user.isProfissional() || user.admin) {

            let [friendsUnpasred, friendsRequestsUnpasred] = await Promise.all([Friends.getAllForProfissional(user.profissional), FriendRequest.getAllByProfessional2Id(user.profissional)]);
            let [friends, friendsRequests] = await Promise.all([getFriends(friendsUnpasred, user.profissional), getFriendsRequest(friendsRequestsUnpasred, user.profissional)]);

            res.status(200).send({
                friends,
                friendsRequests
            })
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
});

router.put('/add', async function (req, res) {
    console.log(req.body)
    if (req.body.email && await User.existsByEmail(req.body.email)) {

        let [user1, user2] = await Promise.all([User.getById(req.session.userid), User.getByEmail(req.body.email)]);
        let request = new FriendRequest({ profissional1: user1.profissional, profissional2: user2.profissional, timestamp: new Date() });
        await request.create();

        res.status(200).send("Friend Request created");
    } else {
        res.status(210).send("This email doenst exists.");
    }
});

router.post('/request/:type', async function (req, res) {
    let friendRequest = await FriendsRequests.getById(req.body.id);
    
    if(req.params.type === 'accept') {

        let friend = new Friends({profissional1: friendRequest.profissional1, profissional2: friendRequest.profissional2, since: new Date()});
        await friend.create();
    }

    await friendRequest.delete();

    res.status(200).send(true);
});

module.exports = router;