const workerQuestions = function(roles) {
  return [
      {
        type : 'input',
        name : 'firstname',
        message : 'Enter firstname ...'
      },
      {
        type : 'input',
        name : 'lastname',
        message : 'Enter lastname ...'
      },
      {
        type : 'input',
        name : 'phone',
        message : 'Enter phone number ...'
      },
      {
        type : 'input',
        name : 'email',
        message : 'Enter email address ...'
      },
      {
        type : 'checkbox',
        name : 'roles',
        message : 'Select the roles ...',
        choices: roles,
        validate: function(answer) {
          if (answer.length < 1) {
            return 'You must choose at least one role.';
          }
          return true;
        }
      }
    ]};
  
  const timeoffQuestions = [
    {
      type : 'input',
      name : 'datestart',
      message : 'Enter start date (YYYY-MM-DD) ...'
    },
    {
      type : 'input',
      name : 'dateend',
      message : 'Enter end date (YYYY-MM-DD) ...'
    }
  ];

  const scheduleQuestions = [
    {
      type : 'input',
      name : 'datestart',
      message : 'Enter start date (YYYY-MM-DD) ...'
    },
    {
      type : 'input',
      name : 'dateend',
      message : 'Enter end date (YYYY-MM-DD) ...'
    },
    {
      type : 'input',
      name : 'type',
      message : 'Enter the schedule type ...'
    }
  ];
  
  const roleQuestions = function(roles) {
    return [
        {
          type : 'checkbox',
          name : 'roles',
          message : 'Select the roles ...',
          choices: roles,
          validate: function(answer) {
            if (answer.length < 1) {
              return 'You must choose at least one role.';
            }
            return true;
          }
        }
      ]};

  const addRoleQuestions = [
        {
          type : 'input',
          name : 'role',
          message : 'Add role ...'
        }
      ];
  
  module.exports = {  workerQuestions, timeoffQuestions, scheduleQuestions, roleQuestions, addRoleQuestions };