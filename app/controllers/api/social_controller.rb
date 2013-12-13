module Api
  class SocialController < BaseController
    def social_ts
      @social_ts = SocialT.all
      render json: @social_ts, status: 201, root: "social_ts"
    end
    def social_fs
      @social_fs = SocialF.all
      render json: @social_fs, status: 201, root: "social_fs"
    end
    def social_ls
      @social_ls = SocialL.all
      render json: @social_ls, status: 201, root: "social_ls"
    end

  end
end