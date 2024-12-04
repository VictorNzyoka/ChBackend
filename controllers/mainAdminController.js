const { User, Group, GroupJoinRequest } = require('../models');

// Fetch all pending users (status = 'ignored')
exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.findAll({ where: { status: 'Ignored' } });
    return res.status(200).json(pendingUsers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching pending users.' });
  }
};

// Approve or reject a user (change their status)
exports.updateUserStatus = async (req, res) => {
  const { uuid } = req.params;         
  const { userId, status } = req.body; 

  console.log('MainAdmin UUID from params:', uuid);  
  console.log('User ID from body:', userId);  

  // Validate the status
  if (status !== 'Accepted' && status !== 'Ignored') {
    return res.status(400).json({ message: 'Invalid status. Must be "Accepted" or "Ignored".' });
  }

  try {
    // Check if the MainAdmin with the given UUID exists
    const mainAdmin = await User.findOne({ where: { uuid, role: 'MainAdmin' } });
    if (!mainAdmin) {
      return res.status(404).json({ message: 'MainAdmin not found or invalid role.' });
    }

    // Check if the user with the given userId exists
    const userToUpdate = await User.findOne({ where: { uuid: userId } });
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Only allow status change if the current status is "Ignored"
    if (userToUpdate.status !== 'Ignored') {
      return res.status(400).json({ message: 'This user cannot be approved/rejected anymore.' });
    }

    // Update the user's status
    userToUpdate.status = status;
    await userToUpdate.save();

    return res.status(200).json({ message: `User's status updated to ${status}.` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'An error occurred while updating the user status.' });
  }
};


// Create a new group and add one user as GroupAdmin
exports.createGroup = async (req, res) => {
  const { name, description, userId } = req.body;

  if (!name || !description || !userId) {
    return res.status(400).json({ message: 'Group name, description, and user ID are required.' });
  }

  try {
    // Check if the user is approved
    const user = await User.findOne({ where: { uuid: userId, status: 'accepted' } });
    if (!user) {
      return res.status(404).json({ message: 'User not found or not accepted.' });
    }

    // Create the group
    const newGroup = await Group.create({
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update the first user as GroupAdmin
    await user.update({ role: 'GroupAdmin' });

    // Add the user to the group
    await newGroup.addUser(user);

    return res.status(201).json({ message: 'Group created successfully and user added as GroupAdmin.', group: newGroup });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error creating group or adding user.' });
  }
};

