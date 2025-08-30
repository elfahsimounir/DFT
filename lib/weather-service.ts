interface WeatherData {
  location: string
  temperature: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
}

export async function getWeatherData(): Promise<WeatherData | null> {
  try {
    const API_KEY = "feb816a6c360195d2140172577820784"
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Paris,FR&appid=${API_KEY}&units=metric&lang=fr`,
    )

    if (!response.ok) {
      throw new Error("Weather API request failed")
    }

    const data = await response.json()

    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return null
  }
}
