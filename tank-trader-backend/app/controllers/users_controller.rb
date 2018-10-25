# frozen_string_literal: true

class UsersController < ApplicationController
  def index
    render json: User.all
  end

  def create
    new_user = User.find_or_create_by(params[:user_name])
    render json: new_user
  end

  private

  def user_params
    params.permit(:user_name)
  end
end
