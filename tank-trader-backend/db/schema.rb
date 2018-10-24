# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_10_24_153416) do

  create_table "events", force: :cascade do |t|
    t.float "skewness"
    t.float "kurtosis"
    t.integer "time_interval"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
  end

  create_table "game_events", force: :cascade do |t|
    t.integer "event_id"
    t.integer "game_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "interval"
    t.index ["event_id"], name: "index_game_events_on_event_id"
    t.index ["game_id"], name: "index_game_events_on_game_id"
  end

  create_table "games", force: :cascade do |t|
    t.integer "user_id"
    t.float "net_value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "end_price"
    t.index ["user_id"], name: "index_games_on_user_id"
  end

  create_table "prices", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "value"
    t.integer "game_id"
    t.index ["game_id"], name: "index_prices_on_game_id"
  end

  create_table "transactions", force: :cascade do |t|
    t.string "action"
    t.float "price"
    t.integer "game_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["game_id"], name: "index_transactions_on_game_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "user_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
