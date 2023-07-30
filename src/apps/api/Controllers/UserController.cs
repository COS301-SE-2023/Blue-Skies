using Microsoft.AspNetCore.Mvc;
using Api.Repository;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly UsersRepository _usersRepository;

    public UserController()
    {
        _usersRepository = new UsersRepository();
    }

    [HttpGet]
    [Route("all")]
    public async Task<IActionResult> GetAllUsers()
    {
        try
        {
            var data = await _usersRepository.GetAllUsers();
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //Update an user
    [HttpPatch]
    [Route("update")]
    public async Task<IActionResult> UpdateUser([FromBody] Users user)
    {
        try
        {
            var data = await _usersRepository.UpdateUsers(
                user.userId,
                user.email!,
                user.password!,
                user.userRole,
                user.dateCreated,
                user.lastLoggedIn
            );
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //Delete an user
    [HttpDelete]
    [Route("delete")]
    public async Task<IActionResult> DeleteUser([FromBody] Users user)
    {
        try
        {
            var data = await _usersRepository.DeleteUsers(user.userId);
            if (data == false)
            {
                return StatusCode(404, "User with id: " + user.userId + " does not exist");
            }
            return Ok("Deleted user with id: " + user.userId + "");
        }
        catch (Exception e)
        {
            return StatusCode(500, e.Message);
        }
    }

    //Get an user by id
    [HttpGet]
    [Route("get/{id}")]
    public async Task<IActionResult> GetUserById([FromRoute] int id)
    {
        try
        {
            var data = await _usersRepository.GetUserById(id);
            return Ok(data);
        }
        catch (Exception e)
        {
            return StatusCode(404, e.Message);
        }
    }
}
