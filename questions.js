const workerQuestions = [
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
      type : 'input',
      name : 'type',
      message : 'Enter the roles (role1,role2) ...'
    }
  ];
  
  const timeoffQuestions = [
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
  
  const roleQuestions = [
    {
      type : 'input',
      name : 'type',
      message : 'Enter a role ...'
    }
  ];
  
  module.exports = {  workerQuestions, timeoffQuestions, scheduleQuestions, roleQuestions };