using System.Collections.Generic;
using System.Linq;
using TodoListApi.Models;
namespace TodoListApi.Services
{
	/// <summary>
	/// In-memory implementation of the IItemRepository.
	/// Stores tasks in a local list for testing and development.
	/// </summary>
	public class InMemoryItemRepository : IItemRepository
	{
		private readonly List<ItemList> _items = new List<ItemList>
		{ };

		/// <inheritdoc/>
		public IEnumerable<ItemList> GetAll() => _items;

		/// <inheritdoc/>
		public ItemList Add(ItemList item)
		{
			item.Id = _items.Count > 0 ? _items.Max(i => i.Id) + 1 : 1;
			_items.Add(item);
			return item;
		}

		/// <inheritdoc/>
		public bool Delete(int id)
		{
			var item = _items.FirstOrDefault(i => i.Id == id);
			if (item == null) return false;
			_items.Remove(item);
			return true;
		}
		/// <inheritdoc/>
		public ItemList? Update(int id, ItemList updatedItem)
		{
			// Find existing item by ID
			var existingItem = _items.FirstOrDefault(i => i.Id == id);
			if (existingItem == null) return null;

			// Update fields on existing item
			existingItem.Task = updatedItem.Task;
			existingItem.Checked = updatedItem.Checked;

			// Return the updated item
			return existingItem;
		}
	}
}

