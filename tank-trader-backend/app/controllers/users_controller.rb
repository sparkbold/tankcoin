# frozen_string_literal: true

class UsersController < ApplicationController
  def index
    render json: User.all
  end

  def create
    puts params
    new_user = User.find_or_create_by(user_params)
    render json: new_user
  end

  private

  def user_params
    params.require(:user).permit(:user_name)
  end
end
