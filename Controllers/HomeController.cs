using Binance.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Flurl;
using Flurl.Http;

namespace Binance.Controllers {
    public class HomeController : Controller {
        private readonly ILogger<HomeController> _logger;

        private static string apiBaseUrl = "https://api.binance.com/api/v1/ticker/24hr";

        public HomeController(ILogger<HomeController> logger) {
            _logger = logger;
        }

        [Route("~/")]
        [Route("~/{fetchInterval}/{treshold}")]
        public IActionResult Index(int fetchInterval = 45, double treshold = 0.005) {
            ViewBag.FetchInterval = fetchInterval;
            ViewBag.Treshold = treshold;
            return View();
        }

        public IActionResult Privacy() {
            return View();
        }

        [Route("~/get-data")]
        public async Task<JsonResult> GetBinanceDataAsync() {
            var list = await apiBaseUrl.GetJsonListAsync();
            return Json(new { Success = true, List = list });
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error() {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
