using System.Collections.Generic;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using TodoListApi.Controllers;
using TodoListApi.Models;
using TodoListApi.Services;
using Xunit;

namespace TodoListApi.Tests.Controllers
{
	public class ItemsControllerTests
	{
		private static ItemsController BuildController(out Mock<IItemRepository> repoMock)
		{
			repoMock = new Mock<IItemRepository>(MockBehavior.Strict);
			return new ItemsController(repoMock.Object);
		}

		[Fact]
		public void GetItems_returns_ok_with_items()
		{
			var controller = BuildController(out var repo);
			var items = new List<ItemList> { new() { Id = 1, Task = "Test", Checked = false } };
			repo.Setup(r => r.GetAll()).Returns(items);

			var result = controller.GetItems();

			var ok = result.Result as OkObjectResult;
			ok.Should().NotBeNull();
			ok!.Value.Should().BeEquivalentTo(items);
			repo.Verify(r => r.GetAll(), Times.Once);
		}

		[Fact]
		public void AddItem_returns_ok_with_created_item()
		{
			var controller = BuildController(out var repo);
			var toAdd = new ItemList { Task = "New", Checked = false };
			var created = new ItemList { Id = 42, Task = "New", Checked = false };
			repo.Setup(r => r.Add(toAdd)).Returns(created);

			var result = controller.AddItem(toAdd);

			var ok = result.Result as OkObjectResult;
			ok.Should().NotBeNull();
			ok!.Value.Should().BeEquivalentTo(created);
			repo.Verify(r => r.Add(toAdd), Times.Once);
		}

		[Fact]
		public void DeleteItem_returns_204_when_found()
		{
			var controller = BuildController(out var repo);
			repo.Setup(r => r.Delete(1)).Returns(true);

			var result = controller.DeleteItem(1) as StatusCodeResult;

			result.Should().NotBeNull();
			result!.StatusCode.Should().Be(204);
			repo.Verify(r => r.Delete(1), Times.Once);
		}

		[Fact]
		public void DeleteItem_returns_404_when_not_found()
		{
			var controller = BuildController(out var repo);
			repo.Setup(r => r.Delete(99)).Returns(false);

			var result = controller.DeleteItem(99) as NotFoundResult;

			result.Should().NotBeNull();
			repo.Verify(r => r.Delete(99), Times.Once);
		}

		[Fact]
		public void UpdateItem_returns_200_with_updated_when_found()
		{
			var controller = BuildController(out var repo);
			var input = new ItemList { Task = "Updated", Checked = true };
			var updated = new ItemList { Id = 7, Task = "Updated", Checked = true };
			repo.Setup(r => r.Update(7, input)).Returns(updated);

			var result = controller.UpdateItem(7, input);

			var ok = result.Result as OkObjectResult;
			ok.Should().NotBeNull();
			ok!.Value.Should().BeEquivalentTo(updated);
			repo.Verify(r => r.Update(7, input), Times.Once);
		}

		[Fact]
		public void UpdateItem_returns_404_when_not_found()
		{
			var controller = BuildController(out var repo);
			var input = new ItemList { Task = "Nope", Checked = false };
			repo.Setup(r => r.Update(123, input)).Returns((ItemList?)null);

			var result = controller.UpdateItem(123, input).Result;

			result.Should().BeOfType<NotFoundResult>();
			repo.Verify(r => r.Update(123, input), Times.Once);
		}
	}
}