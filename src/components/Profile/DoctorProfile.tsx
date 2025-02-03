import { Star, MapPin, Briefcase, GraduationCap } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function DoctorProfile() {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-teal-500"></div>

      {/* Profile Section */}
      <div className="relative px-4 py-16">
        {/* Profile Image */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <img
            src="/placeholder.svg?height=128&width=128"
            alt="Doctor's profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
        </div>

        {/* Name and Info */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Dr. Jane Smith</h1>
          <div className="mt-2 flex items-center justify-center text-yellow-500">
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <Star className="w-5 h-5 fill-current" />
            <span className="ml-2 text-gray-600">(4.9)</span>
          </div>
          <p className="mt-1 text-xl text-gray-600">Cardiologist</p>
          <p className="text-gray-500">15 years of experience</p>
        </div>
      </div>

      {/* Experience Section */}
      <div className="px-4 py-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Experience</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="p-4">
              <h3 className="font-semibold text-lg text-gray-800">Senior Cardiologist</h3>
              <p className="text-gray-600">Heart Center Hospital</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                <span>New York, NY</span>
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <Briefcase className="w-4 h-4 mr-1" />
                <span>2015 - Present</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Blog Section */}
      <div className="px-4 py-6 bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Blog Posts</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg text-gray-800">Understanding Heart Health</h3>
              <p className="text-gray-600 mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <GraduationCap className="w-4 h-4 mr-1" />
                <span>Published on May 15, 2023</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

