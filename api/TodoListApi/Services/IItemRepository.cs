using System.Collections.Generic;
using TodoListApi.Models;

namespace TodoListApi.Services
{
	/// <summary>
	/// Contract for accessing and managing task items.
	/// </summary>
	public interface IItemRepository
	{
		/// <summary>
		/// Retrieves all tasks from the data store.
		/// </summary>
		IEnumerable<ItemList> GetAll();

		/// <summary>
		/// Adds a new task to the data store.
		/// </summary>
		/// <param name="item">The task to add.</param>
		/// <returns>The newly added task with an assigned ID.</returns>
		ItemList Add(ItemList item);

		/// <summary>
		/// Deletes a task by its ID.
		/// </summary>
		/// <param name="id">The ID of the task to delete.</param>
		/// <returns>True if deleted, false if not found.</returns>
		bool Delete(int id);

		// Updates an existing item and returns the updated item
		ItemList? Update(int id, ItemList updatedItem);
	}
}
