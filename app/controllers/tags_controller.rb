class TagsController < ApplicationController

  def create

    tag = Tag.new(params[:tag]);
    if tag.save
      flash[:success] = "New tag saved successfully!"
      respond_to do |format|
        format.json do
          puts "\n\n\n\n\n REQUEST RECEIVED JSOOOOOON *********** \n\n\n\n"

        end
        format.html { puts "\n\n\n\n\n HTML RECEIVED *********** \n\n\n\n"}
      end
    else
      flash[:error] = "Tag failed to save!"
      puts "\n\n\n\n\n TAG SAVE FAIL! ***********"
      puts "#{tag.error}\n\n\n\n"
    end

  end

end
