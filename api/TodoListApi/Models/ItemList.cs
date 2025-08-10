namespace TodoListApi.Models
{
	/// <summary>
	/// Represents a single task item in the to-do list.
	/// </summary>
	public class ItemList
	{
		/// <summary>
		/// Unique identifier for the task.
		/// </summary>
		public int Id { get; set; }

		/// <summary>
		/// Description or title of the task.
		/// </summary>
		public required string Task { get; set; }


		/// <summary>
		/// Indicates whether the task is marked as completed.
		/// </summary>
		public bool Checked { get; set; }
	}
}
