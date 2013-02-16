class TagsController < ApplicationController

  def create

    tag = Tag.new(params[:tag])
    if tag.save
      flash[:success] = "New tag saved successfully!"

      respond_to do |format|
        format.json do
          render json: tag
        end
        format.html { puts "\n\n\n\n\n HTML RECEIVED *********** \n\n\n\n"}
      end

    else
      flash[:error] = "Tag failed to save!"
      puts "\n\n\n\n\n TAG SAVE FAIL! ***********"
      puts "#{tag.error}\n\n\n\n"
    end

  end

  def index

    @tags = Tag.all

    respond_to do |format|
      format.json do
        render json: @tags
      end
    end

  end

  def destroy
    puts "\n\n\n\n\n\n\n\n\n\n\n DESTROYING ********************** \n\n\n\n\n"
    tag = Tag.find(params[:id])
    if tag.delete
      puts "TAG DESTROYED"
      flash[:success] = "Tag was destroyed"
      respond_to do |format|
        format.json { render json: {status: "SUCCESS!"} }
      end
    else
      flash.now[:error] = "Tag was not destroyed"
    end
  end

end
