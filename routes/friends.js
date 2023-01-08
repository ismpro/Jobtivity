const router = require("express").Router();

const Friends = require("../models/FriendsModel");
const FriendRequest = require("../models/FriendRequestModel");
const User = require("../models/UserModel");

router.get('/', async function (req, res) {
    if (req.session.userid) {
        let friendsPromise = Friends.getAllForUser(req.session.userid);
        let userPromise = User.getById(req.session.userid);

        let firstPromise = await Promise.all([friendsPromise, userPromise]);
        let friends = firstPromise[0];
        let user = firstPromise[1];

        if(!friends) {
            res.status(200).send("No friends");
            return;
        }
        
        if (user.isProfissional() || user.admin) {
            let ids = friends.map((friend) => {
                if (friend.profissional1 === user.profissional) return friend.profissional2;
                return friend.profissional1;
            })

            let promises = [];

            for (const id of ids) {
                promises.push(User.getById(id));
            }

            let secondPromise = await Promise.all(promises);

            res.status(200).send(secondPromise.map((userFriend) => {
                let friend = friends.find(friend => friend.profissional1 === userFriend.profissional
                    || friend.profissional2 === userFriend.profissional)
                return {
                    id: userFriend.id,
                    name: userFriend.name,
                    since: friend.since,
                }
            }))
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
});

router.put('/add',async function (req, res) {
    console.log(req.body)
    if (req.body.email && await User.existsByEmail(req.body.email)) {

        let [user1, user2] = await Promise.all([User.getById(req.session.userid), User.getByEmail(req.body.email)]);
        console.log(user1)
        console.log(user2)
        let request = new FriendRequest({profissional1: user1.profissional, profissional2: user2.profissional, timestamp: new Date()});
        console.log(request)
        await request.create();

        res.status(200).send("Friend Request created");
    } else {
        res.status(210).send("This email doenst exists.");
    }
});

module.exports = router;