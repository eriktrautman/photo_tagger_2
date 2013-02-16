class Tag < ActiveRecord::Base
  attr_accessible :name, :image_id, :x, :y

  validates :name, presence: true
  validates :image_id, presence: true
  validates :x, presence: true
  validates :y, presence: true


end
