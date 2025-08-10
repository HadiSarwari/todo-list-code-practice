using System.Linq;
using FluentAssertions;
using TodoListApi.Models;
using TodoListApi.Services;
using Xunit;

namespace TodoListApi.Tests.Services
{
	public class InMemoryItemRepositoryTests
	{
		[Fact]
		public void Add_assigns_incrementing_ids_and_persists()
		{
			var repo = new InMemoryItemRepository();
			var a = repo.Add(new ItemList { Task = "A", Checked = false });
			var b = repo.Add(new ItemList { Task = "B", Checked = true });

			a.Id.Should().Be(1);
			b.Id.Should().Be(2);
			repo.GetAll().Should().HaveCount(2);
		}

		[Fact]
		public void Delete_removes_item_and_returns_true_when_exists()
		{
			var repo = new InMemoryItemRepository();
			var a = repo.Add(new ItemList { Task = "A", Checked = false });

			var ok = repo.Delete(a.Id);

			ok.Should().BeTrue();
			repo.GetAll().Should().BeEmpty();
		}

		[Fact]
		public void Delete_returns_false_when_missing()
		{
			var repo = new InMemoryItemRepository();
			repo.Delete(999).Should().BeFalse();
		}

		[Fact]
		public void Update_changes_fields_when_found_otherwise_null()
		{
			var repo = new InMemoryItemRepository();
			var a = repo.Add(new ItemList { Task = "A", Checked = false });

			var updated = repo.Update(a.Id, new ItemList { Task = "A!", Checked = true });

			updated.Should().NotBeNull();
			updated!.Task.Should().Be("A!");
			updated.Checked.Should().BeTrue();

			repo.Update(123, new ItemList { Task = "X", Checked = false }).Should().BeNull();
		}
	}
}
