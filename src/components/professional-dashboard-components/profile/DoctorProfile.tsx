import { useState } from "react"
import {
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Heart,
  Brain,
  TreesIcon as Lungs,
  Activity,
} from "lucide-react"

const experiences = [
  {
    id: 1,
    title: "Senior Cardiologist",
    hospital: "Heart Center Hospital",
    location: "New York, NY",
    period: "2015 - Present",
    description:
      "Led a team of 10 cardiologists, implemented new treatment protocols, and increased patient satisfaction by 25%. Specialized in complex cardiac surgeries and interventional procedures.",
  },
  {
    id: 2,
    title: "Cardiology Fellow",
    hospital: "University Medical Center",
    location: "Boston, MA",
    period: "2012 - 2015",
    description:
      "Completed advanced training in cardiovascular medicine, participated in clinical research on heart failure treatments, and assisted in over 500 cardiac procedures.",
  },
  {
    id: 3,
    title: "Resident Physician",
    hospital: "General Hospital",
    location: "Chicago, IL",
    period: "2009 - 2012",
    description:
      "Rotated through various medical specialties with a focus on internal medicine and cardiology. Managed patient care in both inpatient and outpatient settings.",
  },
  {
    id: 4,
    title: "Research Assistant",
    hospital: "Cardiovascular Research Institute",
    location: "San Francisco, CA",
    period: "2007 - 2009",
    description:
      "Contributed to groundbreaking research on stem cell therapy for heart disease. Co-authored 3 peer-reviewed publications in leading medical journals.",
  },
  {
    id: 5,
    title: "Medical Intern",
    hospital: "City Medical Center",
    location: "Los Angeles, CA",
    period: "2006 - 2007",
    description:
      "Completed rotations in various departments, gaining hands-on experience in patient care, diagnosis, and treatment planning under supervision of senior physicians.",
  },
]

const blogPosts = [
  {
    id: 1,
    title: "Understanding Heart Health: A Comprehensive Guide",
    icon: Heart,
    date: "May 15, 2023",
    content:
      "Heart health is crucial for overall well-being. This guide covers key aspects of maintaining a healthy heart, including diet, exercise, and stress management. Learn about risk factors for heart disease and practical steps to improve your cardiovascular health.",
  },
  {
    id: 2,
    title: "The Link Between Brain and Heart: Neurocardiology Insights",
    icon: Brain,
    date: "April 3, 2023",
    content:
      "Recent advancements in neurocardiology have revealed fascinating connections between the brain and heart. This post explores how cognitive health impacts heart function and vice versa, offering insights into holistic approaches to health.",
  },
  {
    id: 3,
    title: "Breathing Exercises for Heart Patients",
    icon: Lungs,
    date: "March 18, 2023",
    content:
      "Proper breathing techniques can significantly benefit heart patients. This article presents a series of breathing exercises designed to improve oxygen flow, reduce stress on the heart, and enhance overall cardiovascular function.",
  },
  {
    id: 4,
    title: "Latest Advancements in Cardiac Imaging Technology",
    icon: Activity,
    date: "February 22, 2023",
    content:
      "Explore the cutting-edge developments in cardiac imaging. From 4D echocardiography to AI-assisted CT scans, learn how these technologies are revolutionizing diagnosis and treatment planning in cardiology.",
  },
  {
    id: 5,
    title: "Nutrition for a Healthy Heart: Myths and Facts",
    icon: Heart,
    date: "January 10, 2023",
    content:
      "Separating fact from fiction in heart-healthy diets. This post debunks common nutrition myths and provides evidence-based dietary recommendations for maintaining optimal heart health. Includes meal plans and recipes.",
  },
]

export default function DoctorProfile() {
  const [expandedExperience, setExpandedExperience] = useState<number | null>(null)
  const [expandedBlog, setExpandedBlog] = useState<number | null>(null)

  return (
    <div className="max-w-6xl mx-auto bg-white bg-opacity-90 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-green-200">
      {/* Banner */}
      <div className="h-64 bg-gradient-to-r from-green-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-30"></div>
      </div>

      {/* Profile Section */}
      <div className="relative px-8 py-20">
        {/* Profile Image */}
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
          <img
            src="/placeholder.svg?height=192&width=192"
            alt="Dr. Jane Smith's profile"
            className="w-48 h-48 rounded-full border-4 border-white shadow-xl transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Name and Info */}
        <div className="text-center mt-6">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">Dr. Jane Smith</h1>
          <div className="flex items-center justify-center text-yellow-500 mb-3">
            {[...Array(5)].map((_, index) => (
              <Star key={index} className="w-7 h-7 fill-current" />
            ))}
            <span className="ml-2 text-gray-600 text-xl">(4.9)</span>
          </div>
          <p className="text-3xl text-green-700 font-semibold mb-2">Cardiologist</p>
          <p className="text-gray-600 text-xl">15 years of experience</p>
        </div>
      </div>

      {/* Experience Section */}
      <div className="px-8 py-12 bg-green-50 bg-opacity-50">
        <h2 className="text-4xl font-semibold text-green-700 mb-8">Experience</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:bg-green-50 cursor-pointer"
              onClick={() => setExpandedExperience(expandedExperience === exp.id ? null : exp.id)}
            >
              <h3 className="font-semibold text-2xl text-gray-800 mb-3">{exp.title}</h3>
              <p className="text-gray-700 text-lg mb-2">{exp.hospital}</p>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{exp.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <Briefcase className="w-5 h-5 mr-2" />
                <span>{exp.period}</span>
              </div>
              {expandedExperience === exp.id && <p className="text-gray-600 mt-3 animate-fadeIn">{exp.description}</p>}
              {expandedExperience === exp.id ? (
                <ChevronUp className="w-6 h-6 text-green-600 mt-3" />
              ) : (
                <ChevronDown className="w-6 h-6 text-green-600 mt-3" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Blog Section */}
      <div className="px-8 py-12 bg-gray-50">
        <h2 className="text-4xl font-semibold text-green-700 mb-8">Recent Blog Posts</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer"
              onClick={() => setExpandedBlog(expandedBlog === post.id ? null : post.id)}
            >
              <div className="flex items-center mb-4">
                <post.icon className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="font-semibold text-xl text-gray-800">{post.title}</h3>
              </div>
              <p className="text-gray-600 mb-3">
                {expandedBlog === post.id ? post.content : `${post.content.substring(0, 100)}...`}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <GraduationCap className="w-5 h-5 mr-2" />
                <span>Published on {post.date}</span>
              </div>
              {expandedBlog === post.id ? (
                <ChevronUp className="w-6 h-6 text-green-600 mt-3" />
              ) : (
                <ChevronDown className="w-6 h-6 text-green-600 mt-3" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}