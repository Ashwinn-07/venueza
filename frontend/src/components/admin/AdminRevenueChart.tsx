const AdminRevenueChart = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-6">Revenue</h3>

      <div className="relative h-80">
        {/* This would be replaced with a real chart library like Recharts */}
        <div className="revenue-chart-placeholder relative h-full">
          <svg viewBox="0 0 1200 400" className="w-full h-full">
            {/* Y-axis grid lines */}
            <line
              x1="50"
              y1="50"
              x2="1150"
              y2="50"
              stroke="#f0f0f0"
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="125"
              x2="1150"
              y2="125"
              stroke="#f0f0f0"
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="200"
              x2="1150"
              y2="200"
              stroke="#f0f0f0"
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="275"
              x2="1150"
              y2="275"
              stroke="#f0f0f0"
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="350"
              x2="1150"
              y2="350"
              stroke="#f0f0f0"
              strokeWidth="1"
            />

            {/* Y-axis labels */}
            <text x="30" y="50" textAnchor="end" fontSize="12" fill="#666">
              60
            </text>
            <text x="30" y="125" textAnchor="end" fontSize="12" fill="#666">
              45
            </text>
            <text x="30" y="200" textAnchor="end" fontSize="12" fill="#666">
              30
            </text>
            <text x="30" y="275" textAnchor="end" fontSize="12" fill="#666">
              15
            </text>
            <text x="30" y="350" textAnchor="end" fontSize="12" fill="#666">
              0
            </text>

            {/* X-axis labels */}
            <text x="100" y="370" textAnchor="middle" fontSize="12" fill="#666">
              Jan
            </text>
            <text x="190" y="370" textAnchor="middle" fontSize="12" fill="#666">
              Feb
            </text>
            <text x="280" y="370" textAnchor="middle" fontSize="12" fill="#666">
              Mar
            </text>
            <text x="370" y="370" textAnchor="middle" fontSize="12" fill="#666">
              Apr
            </text>
            <text x="460" y="370" textAnchor="middle" fontSize="12" fill="#666">
              May
            </text>
            <text x="550" y="370" textAnchor="middle" fontSize="12" fill="#666">
              Jun
            </text>
            <text x="640" y="370" textAnchor="middle" fontSize="12" fill="#666">
              Jul
            </text>
            <text x="730" y="370" textAnchor="middle" fontSize="12" fill="#666">
              Aug
            </text>
            <text x="820" y="370" textAnchor="middle" fontSize="12" fill="#666">
              Sep
            </text>
            <text x="910" y="370" textAnchor="middle" fontSize="12" fill="#666">
              Oct
            </text>
            <text
              x="1000"
              y="370"
              textAnchor="middle"
              fontSize="12"
              fill="#666"
            >
              Nov
            </text>
            <text
              x="1090"
              y="370"
              textAnchor="middle"
              fontSize="12"
              fill="#666"
            >
              Dec
            </text>

            {/* Revenue line */}
            <polyline
              points="100,240 190,210 280,230 370,140 460,210 550,230 640,150 730,120 820,180 910,320 1000,280 1090,230"
              fill="none"
              stroke="#F97316"
              strokeWidth="2"
            />

            {/* Data points */}
            <circle cx="100" cy="240" r="4" fill="#F97316" />
            <circle cx="190" cy="210" r="4" fill="#F97316" />
            <circle cx="280" cy="230" r="4" fill="#F97316" />
            <circle cx="370" cy="140" r="4" fill="#F97316" />
            <circle cx="460" cy="210" r="4" fill="#F97316" />
            <circle cx="550" cy="230" r="4" fill="#F97316" />
            <circle cx="640" cy="150" r="4" fill="#F97316" />
            <circle cx="730" cy="120" r="4" fill="#F97316" />
            <circle cx="820" cy="180" r="4" fill="#F97316" />
            <circle cx="910" cy="320" r="4" fill="#F97316" />
            <circle cx="1000" cy="280" r="4" fill="#F97316" />
            <circle cx="1090" cy="230" r="4" fill="#F97316" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AdminRevenueChart;
