import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Capture console messages
        page.on("console", lambda msg: print(f"CONSOLE [{msg.type}]: {msg.text}"))
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))
        
        print("Navigating to http://localhost:8080/index.html")
        await page.goto("http://localhost:8080/index.html")
        
        # Wait for stocks to load
        await page.wait_for_selector(".stock-card")
        
        print("Clicking a stock card...")
        # Click the first stock card
        await page.click(".stock-card")
        
        # Wait a bit for the modal and chart to render
        await page.wait_for_timeout(3000)
        
        print("Done. Closing browser.")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
