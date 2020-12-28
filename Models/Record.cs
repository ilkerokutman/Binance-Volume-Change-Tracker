using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Binance.Models {
    public class Record {

        public string Symbol { get; set; }

        public double PriceChange { get; set; }

        public double PriceChangePercent { get; set; }

        public double LastPrice { get; set; }

        public double HighPrice { get; set; }

        public double LowPrice { get; set; }

        public double Volume { get; set; }
    }
}
