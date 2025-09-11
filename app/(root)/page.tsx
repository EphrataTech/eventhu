'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Search from '@/components/shared/Search'
import {
  Calendar, MapPin, Users, DollarSign, ChevronLeft, ChevronRight,
  Music, Palette, Coffee, UsersIcon, Laptop, Heart, Mountain, Wrench,
  Facebook, Twitter, Instagram, Github,
} from "lucide-react"

type Event = {
  _id: string
  title: string
  category: string
  startDateTime: string
  endDateTime: string
  location: string
  organizer: string
  price: string
  isFree: boolean
  imageUrl: string
  tags: string
}

export default function Home() {
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<Event[]>([])
  const [message, setMessage] = useState('')
  const [approved, setApproved] = useState<Event[]>([])

  useEffect(() => {
    const loadApproved = async () => {
      try {
        const res = await fetch('/api/events?limit=8&page=1', { cache: 'no-store' })
        const json = await res.json()
        const data: any[] = json?.data || []
        const mapped = data.map((e: any) => ({
          _id: e._id,
          title: e.title,
          category: e.category?.name || 'General',
          startDateTime: e.startDateTime,
          endDateTime: e.endDateTime,
          location: e.location,
          organizer: e.organizer ? `${e.organizer.firstName} ${e.organizer.lastName}` : '—',
          price: e.price,
          isFree: e.isFree,
          imageUrl: e.imageUrl,
          tags: ''
        })) as Event[]
        setApproved(mapped)
      } catch (e) {
        // ignore
      }
    }
    loadApproved()
  }, [])

  // Callback triggered by Search component
  const handleSearchResults = (data: Event[], msg: string) => {
    setResults(data)
    setMessage(msg)
    setShowResults(true)
  }

  return (
    <>
      {/* Hero Section with Search */}
      <section className="relative h-[500px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/images/hero.png')" }}>
        <div className="text-center text-white space-y-6 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow">Your Community is Waiting</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Discover local workshops, cleanups, and festivals. Connect with your
            neighbors and make a difference.
          </p>
          <div className="flex justify-center">
            {/* 🔍 Pass callback into Search */}
            <Search onSearch={handleSearchResults} />
          </div>
        </div>
      </section>

      {/* If search results exist, show results instead of homepage sections */}
      {showResults ? (
        <section className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Search Results</h2>

            {message && <p className="text-red-600">{message}</p>}

            {results.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {results.map(event => (
                  <EventCard
                    key={event._id}
                    id={event._id}
                    image={event.imageUrl}
                    category={event.category}
                    title={event.title}
                    date={new Date(event.startDateTime).toLocaleDateString()}
                    location={event.location}
                    attendees={"N/A"} // your API doesn't return attendees count yet
                    price={event.isFree ? "Free" : `$${event.price}`}
                    organizer={event.organizer}
                    variant="light"
                  />
                ))}
              </div>
            )}

            <div className="mt-6">
              <Button
                onClick={() => setShowResults(false)}
                className="bg-gray-300 text-black hover:bg-gray-400"
              >
                ⬅ Back to Homepage
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="bg-gray-100 py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Connect in Three Easy Steps</h2>
            <div className="flex justify-center gap-12">
              <div className="w-60 space-y-3">
                <div className="text-4xl text-purple-600">🔍</div>
                <h3 className="font-semibold">Find an Event</h3>
                <p className="text-sm text-gray-600">
                  Use our smart search to find events that match your interests.
                </p>
              </div>
              <div className="w-60 space-y-3">
                <div className="text-4xl text-purple-600">✅</div>
                <h3 className="font-semibold">RSVP in a Tap</h3>
                <p className="text-sm text-gray-600">
                  Confirm your spot and add events to your calendar.
                </p>
              </div>
              <div className="w-60 space-y-3">
                <div className="text-4xl text-purple-600">➕</div>
                <h3 className="font-semibold">Create Your Own</h3>
                <p className="text-sm text-gray-600">
                  Organizers can Post and Manage events for free.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-purple-700 py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white text-balance">Recommended For You</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {approved.length > 0 ? approved.map((ev) => (
                  <EventCard
                    key={ev._id}
                    id={ev._id}
                    image={ev.imageUrl}
                    category={ev.category}
                    title={ev.title}
                    date={new Date(ev.startDateTime).toLocaleString()}
                    location={ev.location}
                    attendees={''}
                    price={ev.isFree ? 'Free' : ev.price}
                    organizer={ev.organizer}
                  />
                )) : (
                  <>
                    <EventCard
                      image="assets\\images\\urban-concert-stage-with-purple-lighting.png"
                      category="Music"
                      title="Urban Beats Concert"
                      date="Fri, Sept 12 • 7:00 PM"
                      location="Kasarani Stadium"
                      attendees="554 attending"
                      price="500"
                      organizer="David K."
                    />
                    <EventCard
                      image="assets\\images\\volunteers-cleaning-park-environment.png"
                      category="Volunteer"
                      title="Green Future Cleanup Drive"
                      date="Sun, Sept 15 • 9:00 AM"
                      location="Uhuru Park, Nairobi"
                      attendees="204 attending"
                      price="Free"
                    />
                    <EventCard
                      image="assets/images/tech-hackathon-coding-workspace.png"
                      category="Tech"
                      title="Tech for Tomorrow Hackathon"
                      date="Sept 14-15 • 8:00 AM"
                      location="Strathmore University, Nairobi"
                      attendees="500 attending"
                      price="Free"
                    />
                    <EventCard
                      image="assets/images/jazz-festival-concert-crowd-blue-lights.png"
                      category="Music"
                      title="Summer Jazz Festival"
                      date="7/15/2025 at 7:00PM"
                      location="Central Park"
                      attendees="254 attending"
                      price="36"
                    />
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Trending in Nairobi */}
          <section className="bg-white py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-balance">Trending in Nairobi</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <EventCard
                  image="assets/images/yoga-wellness-morning-session.png"
                  category="Health"
                  title="Wellness & Yoga Morning"
                  date="Sat, Sept 21 • 6:30 AM"
                  location="Karura Forest, Nairobi"
                  attendees="500 Attending"
                  price="KES 300"
                  variant="light"
                />

                <EventCard
                  image="assets/images/street-food-festival-night-market.png"
                  category="Food"
                  title="Street Food Festival"
                  date="Sat, Sept 28 • 11:00 AM"
                  location="KICC Grounds, Nairobi"
                  attendees="354 attending"
                  price="200"
                  variant="light"
                />

                <EventCard
                  image="assets/images/business-startup-pitch-presentation.png"
                  category="Business"
                  title="Startup Pitch Night"
                  date="Thurs, Sept 26 • 6:00 PM"
                  location="iHub, Nairobi"
                  attendees="645 attending"
                  price="1000"
                  variant="light"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <EventCard
                  image="assets/images/local-football-derby-match-stadium.png"
                  category="Sports"
                  title="Local Football Derby"
                  date="Sat, Oct 5 • 3:00 PM"
                  location="Nyayo National Stadium, Nairobi"
                  attendees="400 attending"
                  price="150"
                  variant="light"
                />

                <EventCard
                  image="assets/images/church-youth-conference-gathering.png"
                  category="Church"
                  title="Church Youth Conference"
                  date="Sun, Sept 29 • 2:00 PM"
                  location="Nairobi Chapel, Ngong Road"
                  attendees="300 attending"
                  price="Free"
                  variant="light"
                />

                <EventCard
                  image="assets/images/campus-talent-show-performance-stage.png"
                  category="Community"
                  title="Campus Talent Show"
                  date="Wed, Sept 18 • 5:30 PM"
                  location="Kenyatta University Main Hall"
                  attendees="400 attending"
                  price="200"
                  variant="light"
                />
              </div>
            </div>
          </section>

          {/* Explore Your Interests */}
          <section className="bg-gray-50 py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-balance">Explore Your Interests</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <InterestCard icon={Music} title="Music" />
                <InterestCard icon={Palette} title="Art & Culture" />
                <InterestCard icon={Coffee} title="Food & Drink" />
                <InterestCard icon={UsersIcon} title="Community" />
                <InterestCard icon={Laptop} title="Tech" />
                <InterestCard icon={Heart} title="Health & Wellness" />
                <InterestCard icon={Mountain} title="Outdoors" />
                <InterestCard icon={Wrench} title="Workshops" />
              </div>
            </div>
          </section>

          {/* Community Testimonial */}
          <section className="bg-white py-12 md:py-16">
            <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-12 text-balance">What Our Community is Saying</h2>

              <div className="relative max-w-3xl mx-auto">
                <div className="overflow-hidden">
                  <div className="flex gap-6 animate-[slide_24s_linear_infinite] hover:[animation-play-state:paused]">
                    {[{
                      quote: "EventHub doubled our attendance in two months.",
                      name: "David Kamau",
                      title: "Workshop Organizer"
                    },{
                      quote: "The checkout is seamless. Our team loves it.",
                      name: "Aisha Ali",
                      title: "Community Lead"
                    },{
                      quote: "The easiest way to discover local events.",
                      name: "Brian Otieno",
                      title: "Student"
                    },{
                      quote: "Posting events takes minutes. So good!",
                      name: "Lucy Wanjiru",
                      title: "Volunteer Coordinator"
                    }].map((t, idx) => (
                      <Card key={idx} className="min-w-[280px] sm:min-w-[360px]">
                        <CardContent className="p-6 text-left">
                          <div className="text-3xl text-purple-600 mb-3">"</div>
                          <p className="mb-4 text-pretty">{t.quote}</p>
                          <div>
                            <p className="font-semibold">{t.name}</p>
                            <p className="text-muted-foreground text-sm">{t.title}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <style>{`@keyframes slide { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
              </div>
            </div>
          </section>

          {/* Host Your Own Event CTA */}
          <section className="bg-gray-50 py-12 md:py-16">
            <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-balance">Want to Host Your Own Event?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                EventHub is the easiest way to reach an engaged local audience. Post your event in minutes and watch your
                community grow.
              </p>
              <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
                <Link href="/events/create">Create an Event for Free</Link>
              </Button>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-purple-700 dark:bg-purple-950 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">E</span>
                </div>
                <span className="font-semibold text-lg">EventHub</span>
              </div>
              <p className="text-white/80 text-sm text-pretty">
                Connecting communities through meaningful events. Discover, create, and participate in local experiences
                that bring people together.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-white/80 hover:text-white">
                    Discover Events
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white">
                    For Organizers
                  </a>
                </li>
                <li>
                  <Link href="/about" className="text-white/80 hover:text-white">About Us</Link>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-white/80 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-white">
                    Community Guidelines
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <Facebook className="w-5 h-5 text-white/80 hover:text-white cursor-pointer" />
                <Twitter className="w-5 h-5 text-white/80 hover:text-white cursor-pointer" />
                <Instagram className="w-5 h-5 text-white/80 hover:text-white cursor-pointer" />
                <Github className="w-5 h-5 text-white/80 hover:text-white cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}


interface EventCardProps {
  image: string
  category: string
  title: string
  date: string
  location: string
  attendees: string
  price: string
  organizer?: string
  variant?: "dark" | "light"
  id?: string
}

function EventCard({
  image,
  category,
  title,
  date,
  location,
  attendees,
  price,
  organizer,
  variant = "dark",
  id,
}: EventCardProps) {
  const isDark = variant === "dark"

  return (
    <Card className={`overflow-hidden ${isDark ? "bg-white" : "bg-white"} hover:shadow-lg transition-shadow`}>
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
        <Badge
          className={`absolute top-3 left-3 ${isDark ? "bg-white text-purple-700" : "bg-purple-100 text-purple-700"}`}
        >
          {category}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 text-balance">{title}</h3>

        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{attendees}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>{price}</span>
          </div>
        </div>

        {organizer && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xs font-semibold">{organizer[0]}</span>
            </div>
            <span className="text-sm text-muted-foreground">{organizer}</span>
          </div>
        )}

        {id ? (
          <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            <Link href={`/events/${id}`}>Learn More</Link>
          </Button>
        ) : (
          <Button disabled className="w-full bg-gray-300 text-gray-600 cursor-not-allowed">
            Learn More
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

interface InterestCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
}

function InterestCard({ icon: Icon, title }: InterestCardProps) {
  return (
    <Card className="p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
      <Icon className="w-8 h-8 mx-auto mb-3 text-purple-600" />
      <h3 className="font-medium text-sm">{title}</h3>
    </Card>
  )
}

   



