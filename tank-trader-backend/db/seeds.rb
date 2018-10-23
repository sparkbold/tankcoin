# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
user1 = User.create(user_name: 'trung')
user2 = User.create(user_name: 'andrew')

event1 = Event.create(name: 'event1', description: 'desp1', time_interval: rand(1..5), skewness: rand(-0.02..0.02), kurtosis: rand(0.02..0.05))
event2 = Event.create(name: 'event2', description: 'desp2', time_interval: rand(1..5), skewness: rand(-0.02..0.02), kurtosis: rand(0.02..0.05))
event3 = Event.create(name: 'event3', description: 'desp3', time_interval: rand(1..5), skewness: rand(-0.02..0.02), kurtosis: rand(0.02..0.05))
event4 = Event.create(name: 'event4', description: 'desp4', time_interval: rand(1..5), skewness: rand(-0.02..0.02), kurtosis: rand(0.02..0.05))
event5 = Event.create(name: 'event5', description: 'desp5', time_interval: rand(1..5), skewness: rand(-0.02..0.02), kurtosis: rand(0.02..0.05))
event6 = Event.create(name: 'event6', description: 'desp6', time_interval: rand(1..5), skewness: rand(-0.02..0.02), kurtosis: rand(0.02..0.05))
event7 = Event.create(name: 'event7', description: 'desp7', time_interval: rand(1..5), skewness: rand(-0.02..0.02), kurtosis: rand(0.02..0.05))
event8 = Event.create(name: 'event8', description: 'desp8', time_interval: rand(1..5), skewness: rand(-0.02..0.02), kurtosis: rand(0.02..0.05))
event9 = Event.create(name: 'event9', description: 'desp9', time_interval: rand(1..5), skewness: rand(-0.02..0.02), kurtosis: rand(0.02..0.05))
event10 = Event.create(name: 'event10', description: 'desp10', time_interval: rand(1..5), skewness: rand(-0.02..0.02), kurtosis: rand(0.02..0.05))
