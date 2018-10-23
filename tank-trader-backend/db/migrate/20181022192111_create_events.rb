class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.float :skewness
      t.float :kurtosis
      t.integer :time_interval
      t.text :description

      t.timestamps
    end
  end
end
