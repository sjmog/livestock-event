# encoding: UTF-8
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

ActiveRecord::Schema.define(version: 20140207173112) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", force: true do |t|
    t.integer  "trackable_id"
    t.string   "trackable_type"
    t.integer  "owner_id"
    t.string   "owner_type"
    t.string   "key"
    t.text     "parameters"
    t.integer  "recipient_id"
    t.string   "recipient_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "activities", ["owner_id", "owner_type"], name: "index_activities_on_owner_id_and_owner_type", using: :btree
  add_index "activities", ["recipient_id", "recipient_type"], name: "index_activities_on_recipient_id_and_recipient_type", using: :btree
  add_index "activities", ["trackable_id", "trackable_type"], name: "index_activities_on_trackable_id_and_trackable_type", using: :btree

  create_table "administrators", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "role"
  end

  add_index "administrators", ["email"], name: "index_administrators_on_email", unique: true, using: :btree
  add_index "administrators", ["reset_password_token"], name: "index_administrators_on_reset_password_token", unique: true, using: :btree

  create_table "api_keys", force: true do |t|
    t.integer  "user_id"
    t.string   "access_token"
    t.string   "scope"
    t.datetime "expired_at"
    t.datetime "created_at"
  end

  add_index "api_keys", ["access_token"], name: "index_api_keys_on_access_token", unique: true, using: :btree
  add_index "api_keys", ["user_id"], name: "index_api_keys_on_user_id", using: :btree

  create_table "articles", force: true do |t|
    t.string   "title"
    t.datetime "published"
    t.string   "author"
    t.text     "article_content"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image"
  end

  create_table "bookings", force: true do |t|
    t.string   "company_name"
    t.string   "company_reg"
    t.boolean  "corporate_membership"
    t.string   "correspondence_address"
    t.string   "invoice_address"
    t.boolean  "tc_agreed"
    t.string   "show_area"
    t.boolean  "same_as2013"
    t.string   "stand_type"
    t.integer  "frontage"
    t.integer  "depth"
    t.string   "position"
    t.boolean  "deposit_paid"
    t.boolean  "total_paid"
    t.string   "breed_society"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "zone"
    t.boolean  "requires_leaflets"
    t.integer  "number_leaflets"
    t.boolean  "pdf_leaflet"
    t.boolean  "machinery_motion"
    t.boolean  "mobile_unit"
    t.boolean  "livestock_stand"
    t.boolean  "new_products"
    t.boolean  "philip_award"
    t.boolean  "livestock_award"
    t.boolean  "exports"
    t.boolean  "exhibitor_list"
    t.string   "website"
    t.string   "contact_name"
    t.string   "telephone"
    t.string   "email"
    t.text     "notes"
    t.string   "exhibiting_name"
    t.string   "po_number"
    t.string   "finance_contact"
    t.string   "finance_telephone"
    t.string   "contractor_company_name"
    t.text     "contractor_address"
    t.string   "contractor_telephone"
    t.string   "contractor_email"
    t.string   "contractor_contact_name"
    t.boolean  "placements"
    t.integer  "user_id"
    t.decimal  "the_deposit"
    t.decimal  "the_total"
    t.string   "stand_number"
    t.integer  "stand_id"
    t.text     "requirements"
    t.integer  "order_id"
    t.boolean  "needs_attention"
    t.string   "attention_type"
  end

  create_table "buttons", force: true do |t|
    t.integer  "tile_id"
    t.string   "icon"
    t.string   "button_link"
    t.string   "title"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "flip_button"
  end

  add_index "buttons", ["tile_id"], name: "index_buttons_on_tile_id", using: :btree

  create_table "contractors", force: true do |t|
    t.string   "name"
    t.string   "company_name"
    t.text     "address"
    t.text     "explanation"
    t.string   "category"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image"
  end

  create_table "exhibitors", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "telephone"
    t.string   "website"
    t.string   "area"
    t.string   "zone"
    t.boolean  "list"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "fbposts", force: true do |t|
    t.string   "user"
    t.date     "published"
    t.text     "fbcontent"
    t.string   "avatar"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "hazards", force: true do |t|
    t.integer  "raform_id"
    t.string   "name"
    t.text     "persons"
    t.string   "level"
    t.string   "rassociation"
    t.text     "controls"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "hazards", ["raform_id"], name: "index_hazards_on_raform_id", using: :btree

  create_table "hsforms", force: true do |t|
    t.integer  "booking_id"
    t.integer  "progress"
    t.boolean  "complete"
    t.string   "company_name"
    t.string   "name"
    t.string   "mobile"
    t.text     "particulars"
    t.boolean  "policy"
    t.boolean  "public_insurance"
    t.boolean  "employee_insurance"
    t.boolean  "tick_1"
    t.boolean  "tick_2"
    t.boolean  "tick_3"
    t.boolean  "tick_4"
    t.boolean  "tick_5"
    t.boolean  "tick_6"
    t.boolean  "tick_7"
    t.boolean  "agreed"
    t.string   "completed_by"
    t.string   "date"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "verified"
  end

  add_index "hsforms", ["booking_id"], name: "index_hsforms_on_booking_id", using: :btree

  create_table "lkupdates", force: true do |t|
    t.string   "user"
    t.text     "lkcontent"
    t.date     "published"
    t.string   "avatar"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "orders", force: true do |t|
    t.string   "status"
    t.decimal  "amount"
    t.date     "date"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.integer  "booking_id"
    t.string   "billing_surname"
    t.string   "billing_firstnames"
    t.string   "billing_address"
    t.string   "billing_city"
    t.string   "billing_postcode"
    t.string   "billing_country"
    t.string   "delivery_surname"
    t.string   "delivery_firstnames"
    t.string   "delivery_address"
    t.string   "delivery_city"
    t.string   "delivery_postcode"
    t.string   "delivery_country"
    t.decimal  "the_deposit"
    t.decimal  "the_total"
  end

  create_table "posts", force: true do |t|
    t.string   "title"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "raforms", force: true do |t|
    t.integer  "booking_id"
    t.text     "particulars"
    t.text     "equipment"
    t.boolean  "complex"
    t.string   "company_name"
    t.string   "conducted_by"
    t.string   "signature"
    t.string   "date"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "verified"
    t.boolean  "complete"
    t.integer  "progress"
  end

  add_index "raforms", ["booking_id"], name: "index_raforms_on_booking_id", using: :btree

  create_table "rails_admin_histories", force: true do |t|
    t.text     "message"
    t.string   "username"
    t.integer  "item"
    t.string   "table"
    t.integer  "month",      limit: 2
    t.integer  "year",       limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "rails_admin_histories", ["item", "table", "month", "year"], name: "index_rails_admin_histories", using: :btree

  create_table "roles", force: true do |t|
    t.string   "name"
    t.integer  "resource_id"
    t.string   "resource_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "roles", ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id", using: :btree
  add_index "roles", ["name"], name: "index_roles_on_name", using: :btree

  create_table "showforms", force: true do |t|
    t.integer  "booking_id"
    t.integer  "progress"
    t.boolean  "complete"
    t.boolean  "verified"
    t.string   "company_name"
    t.string   "contact_name"
    t.text     "address"
    t.string   "telephone"
    t.string   "email"
    t.string   "website"
    t.text     "particulars"
    t.boolean  "dairy"
    t.boolean  "beef"
    t.boolean  "sheep"
    t.boolean  "goats"
    t.boolean  "pigs"
    t.boolean  "poultry"
    t.boolean  "arable"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "showforms", ["booking_id"], name: "index_showforms_on_booking_id", using: :btree

  create_table "social_fs", force: true do |t|
    t.string   "user"
    t.text     "text"
    t.datetime "published"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "uid"
    t.string   "link"
    t.integer  "likes"
  end

  create_table "social_ls", force: true do |t|
    t.string   "user"
    t.text     "text"
    t.datetime "published"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "uid"
    t.string   "link"
  end

  create_table "social_ts", force: true do |t|
    t.string   "user"
    t.text     "text"
    t.datetime "published"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "uid"
    t.string   "link"
  end

  create_table "stands", force: true do |t|
    t.integer  "number"
    t.boolean  "taken"
    t.integer  "frontage"
    t.integer  "depth"
    t.string   "area"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "booking_id"
    t.string   "zone"
  end

  create_table "supporters", force: true do |t|
    t.string   "name"
    t.string   "company_name"
    t.text     "address"
    t.text     "explanation"
    t.string   "category"
    t.string   "image"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tabs", force: true do |t|
    t.integer  "tile_id"
    t.text     "tab_content"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name"
    t.string   "icon"
    t.string   "tab_type"
    t.text     "split_left"
    t.text     "split_right"
    t.string   "split_title"
    t.string   "tab_link"
    t.string   "tab_large_icon"
    t.text     "split_text"
  end

  add_index "tabs", ["tile_id"], name: "index_tabs_on_tile_id", using: :btree

  create_table "testimonials", force: true do |t|
    t.string   "image"
    t.string   "attribution"
    t.text     "quote"
    t.string   "category"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "filepicker_url"
    t.string   "location"
    t.string   "call_route"
    t.string   "call_route_name"
    t.string   "call_icon"
  end

  create_table "tiles", force: true do |t|
    t.string   "tile_type"
    t.string   "height"
    t.string   "width"
    t.string   "group"
    t.text     "tile_content"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title"
    t.string   "name"
    t.boolean  "exhibitor"
    t.boolean  "visitor"
    t.boolean  "general"
    t.boolean  "flips"
    t.string   "flip_title"
    t.text     "flip_content"
    t.boolean  "flip_buttons"
    t.string   "tile_variety"
    t.boolean  "has_sidebar"
    t.string   "tile_route"
  end

  create_table "tweets", force: true do |t|
    t.string   "user"
    t.date     "published"
    t.text     "tweetcontent"
    t.string   "avatar"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "authentication_token"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name"
    t.string   "password_digest"
    t.string   "username"
    t.string   "role"
  end

  add_index "users", ["authentication_token"], name: "index_users_on_authentication_token", unique: true, using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "users_roles", id: false, force: true do |t|
    t.integer "user_id"
    t.integer "role_id"
  end

  add_index "users_roles", ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id", using: :btree

end
