pragma solidity ^0.8.13;

contract Bloc{
 struct Task{
    string task;
       bool isDone;
   }
   mapping (address => Task[]) private Users;

   function addTask(string calldata _task) external{
      Users[msg.sender].push(Task({
          task:_task,
          isDone:false
      }));
   } 

   function getTask(uint _taskIndex) external view returns (Task memory){
       Task storage task = Users[msg.sender][_taskIndex];
       return task;
   } 

   function updateStatus(uint256 _taskIndex,bool _status) external{
        Users[msg.sender][_taskIndex].isDone = _status;
   } 

   function deleteTask(uint256 _taskIndex) external{
       delete Users[msg.sender][_taskIndex];
   } 
}  