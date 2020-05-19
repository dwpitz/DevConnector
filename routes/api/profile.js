const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

//@route Get api/profile/me
//@descript Get current user's profile
//@access Private
router.get('/me', auth, async (req, res) => {
  try {
    //We take the Profile model and find one user by the user id.
    const profile = await Profile.findOne({
      //This user pertains to the user field in the profile model.  It returns the user's object id
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route POST api/profile
//@descript Create or Update A User Profile
//@access Private
router.post(
  '/',
  [
    auth,
    [
      //This Checks For Errors
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills Are Required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //Build Profile Object to insert into the database
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      console.log(123);
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    //Build Social Object
    profileFields.social = {};
    if (youtube) profileFields.youtube = youtube;
    if (twitter) profileFields.twitter = twitter;
    if (facebook) profileFields.facebook = facebook;
    if (linkedin) profileFields.linkedin = linkedin;
    if (instagram) profileFields.instagram = instagram;

    try {
      //We are looking for a profile by the user
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //We update the profile if it's found
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //If the profile is not found we, we create a new one and save it.
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(500).send('Server Error');
    }
  }
);

module.exports = router;
