class TagsController < ApplicationController

  def create
    respond_to do |format|
      format.json { puts "\n\n\n\n\n REQUEST RECEIVED JSOOOOOON *********** \n\n\n\n"}
      format.html { puts "\n\n\n\n\n HTML RECEIVED *********** \n\n\n\n"}
    end
  end

end
