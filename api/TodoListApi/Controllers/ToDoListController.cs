using Microsoft.AspNetCore.Mvc;
using TodoListApi.Models;
using TodoListApi.Services;

namespace TodoListApi.Controllers
{
	/// <summary>
	/// API controller that manages task items.
	/// Handles listing, adding, and deleting tasks.
	/// </summary>

	[ApiController]
	[Route("items")]
	public class ItemsController : ControllerBase
	{
		private readonly IItemRepository _repository;
		/// <summary>
		/// Constructor for ItemsController.
		/// </summary>
		/// <param name="repository">The task repository implementation.</param>
		public ItemsController(IItemRepository repository)
		{
			_repository = repository;
		}


		/// <summary>
		/// Gets all tasks from the repository.
		/// </summary>
		/// <returns>A list of all tasks.</returns>
		[HttpGet]
		public ActionResult<IEnumerable<ItemList>> GetItems()
		{
			return Ok(_repository.GetAll());
		}


		/// <summary>
		/// Adds a new task to the repository.
		/// </summary>
		/// <param name="item">The task object to add.</param>
		/// <returns>The created task with its assigned ID.</returns>
		[HttpPost]
		public ActionResult<ItemList> AddItem(ItemList item)
		{
			var addedItem = _repository.Add(item);
			return Ok(addedItem);
		}


		/// <summary>
		/// Deletes a task by its ID.
		/// </summary>
		/// <param name="id">The ID of the task to delete.</param>
		/// <returns>204 No Content if deleted, 404 if not found.</returns>
		[HttpDelete("{id}")]
		public IActionResult DeleteItem(int id)
		{
			var success = _repository.Delete(id);
			if (!success) return NotFound();
			return NoContent();
		}

		// Updates an existing item by ID
		[HttpPut("{id}")]
		public ActionResult<ItemList> UpdateItem(int id, ItemList updatedItem)
		{
			// Call repository to update the item
			var item = _repository.Update(id, updatedItem);

			// If item not found, return 404 Not Found
			if (item == null) return NotFound();

			// Return updated item with 200 OK
			return Ok(item);
		}

	}
}

