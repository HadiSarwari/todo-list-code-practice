using TodoListApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Register the repository with DI
builder.Services.AddSingleton<IItemRepository, InMemoryItemRepository>();

// Allow CORS
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAngular",
			policy =>
			{
				policy.WithOrigins("http://localhost:4200")
								.AllowAnyMethod()
								.AllowAnyHeader();
			});
});


// Add controllers & Swagger
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Swagger in development
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Example endpoint (WeatherForecast) - default template
var summaries = new[]
{
		"Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
	var forecast = Enumerable.Range(1, 5).Select(index =>
			new WeatherForecast
			(
					DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
					Random.Shared.Next(-20, 55),
					summaries[Random.Shared.Next(summaries.Length)]
			))
			.ToArray();
	return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();


app.UseCors("AllowAngular");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

internal record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
	public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
