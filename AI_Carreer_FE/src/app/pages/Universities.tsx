import { useState } from "react";
import { MapPin, DollarSign, TrendingUp, Award, Search, SlidersHorizontal, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { PremiumGate } from "../components/PremiumGate";
import { usePremium } from "../utils/usePremium";

const universities = [
  {
    name: "MIT",
    location: "Cambridge, MA",
    tuition: "$53,790",
    admissionScore: 95,
    probability: "Medium",
    major: "Computer Science",
    ranking: 1,
    acceptanceRate: "7%",
    fourYearCost: "$215,160"
  },
  {
    name: "Stanford University",
    location: "Stanford, CA",
    tuition: "$56,169",
    admissionScore: 94,
    probability: "Medium",
    major: "Computer Science",
    ranking: 2,
    acceptanceRate: "5%",
    fourYearCost: "$224,676"
  },
  {
    name: "Carnegie Mellon University",
    location: "Pittsburgh, PA",
    tuition: "$59,864",
    admissionScore: 93,
    probability: "High",
    major: "Computer Science",
    ranking: 3,
    acceptanceRate: "13%",
    fourYearCost: "$239,456"
  },
  {
    name: "UC Berkeley",
    location: "Berkeley, CA",
    tuition: "$44,115",
    admissionScore: 92,
    probability: "High",
    major: "Computer Science",
    ranking: 4,
    acceptanceRate: "15%",
    fourYearCost: "$176,460"
  },
  {
    name: "Georgia Tech",
    location: "Atlanta, GA",
    tuition: "$33,794",
    admissionScore: 88,
    probability: "High",
    major: "Computer Science",
    ranking: 8,
    acceptanceRate: "18%",
    fourYearCost: "$135,176"
  },
  {
    name: "University of Illinois",
    location: "Urbana-Champaign, IL",
    tuition: "$34,316",
    admissionScore: 87,
    probability: "High",
    major: "Computer Science",
    ranking: 10,
    acceptanceRate: "45%",
    fourYearCost: "$137,264"
  },
];

export function Universities() {
  const { isPremium } = usePremium();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    maxTuition: 70000,
    minScore: 80,
    probability: "All",
  });

  if (!isPremium) {
    return (
      <PremiumGate
        title="Danh sách trường phù hợp"
        description="Kích hoạt Premium để xem danh sách trường, lọc theo vị trí và tài chính."
      />
    );
  }

  const filteredUniversities = universities.filter((uni) => {
    const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         uni.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTuition = parseInt(uni.tuition.replace(/[$,]/g, "")) <= filters.maxTuition;
    const matchesScore = uni.admissionScore >= filters.minScore;
    const matchesProbability = filters.probability === "All" || uni.probability === filters.probability;
    
    return matchesSearch && matchesTuition && matchesScore && matchesProbability;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-4">Gợi ý trường đại học</h1>
          <p className="text-xl text-gray-600">
            Các trường có ngành phù hợp với bạn kèm xác suất trúng tuyển
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm trường hoặc địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all"
            >
              <SlidersHorizontal className="size-5" />
              <span>Bộ lọc</span>
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="grid md:grid-cols-3 gap-6 pt-4 border-t border-gray-200"
            >
              <div>
                <label className="block mb-2 text-sm">Học phí tối đa mỗi năm</label>
                <input
                  type="range"
                  min="20000"
                  max="70000"
                  step="5000"
                  value={filters.maxTuition}
                  onChange={(e) => setFilters({ ...filters, maxTuition: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 mt-1">
                  ${filters.maxTuition.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm">Điểm tuyển sinh tối thiểu</label>
                <input
                  type="range"
                  min="70"
                  max="100"
                  value={filters.minScore}
                  onChange={(e) => setFilters({ ...filters, minScore: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 mt-1">{filters.minScore}</div>
              </div>

              <div>
                <label className="block mb-2 text-sm">Xác suất trúng tuyển</label>
                <select
                  value={filters.probability}
                  onChange={(e) => setFilters({ ...filters, probability: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>Tất cả</option>
                  <option value="High">Cao</option>
                  <option value="Medium">Trung bình</option>
                  <option value="Low">Thấp</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          Hiển thị {filteredUniversities.length} trường
        </div>

        {/* University Cards */}
        <div className="space-y-6">
          {filteredUniversities.map((uni, idx) => (
            <motion.div
              key={uni.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl">{uni.name}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        Hạng #{uni.ranking}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="size-4" />
                        <span className="text-sm">{uni.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="size-4" />
                        <span className="text-sm">Tỷ lệ nhận: {uni.acceptanceRate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span
                      className={`inline-block px-4 py-2 rounded-lg text-sm ${
                        uni.probability === "High"
                          ? "bg-blue-100 text-blue-700"
                          : uni.probability === "Medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {uni.probability === "High" ? "Cao" : uni.probability === "Medium" ? "Trung bình" : "Thấp"} — Xác suất trúng tuyển
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6 mb-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="size-5 text-blue-600" />
                      <span className="text-sm text-blue-900">Học phí/năm</span>
                    </div>
                    <div className="text-2xl font-semibold text-blue-600">{uni.tuition}</div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="size-5 text-blue-600" />
                      <span className="text-sm text-blue-900">Điểm tuyển sinh</span>
                    </div>
                    <div className="text-2xl font-semibold text-blue-600">{uni.admissionScore}</div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="size-5 text-orange-600" />
                      <span className="text-sm text-orange-900">Chi phí 4 năm</span>
                    </div>
                    <div className="text-2xl font-semibold text-orange-600">{uni.fourYearCost}</div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="size-5 text-orange-600" />
                      <span className="text-sm text-orange-900">Độ phù hợp</span>
                    </div>
                    <div className="text-2xl font-semibold text-orange-600">
                      {100 - uni.admissionScore + 5}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-sm text-gray-600">Ngành: </span>
                    <span className="text-sm font-semibold text-blue-700">{uni.major}</span>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 hover:shadow-lg transition-all">
                    <span>Tìm hiểu thêm</span>
                    <ExternalLink className="size-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredUniversities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Không có trường nào khớp với bộ lọc hiện tại</p>
            <button
              onClick={() => {
                setFilters({ maxTuition: 70000, minScore: 80, probability: "All" });
                setSearchTerm("");
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
