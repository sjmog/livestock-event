class ArticleSerializer < BaseSerializer
  attributes :id, :title, :published, :author, :article_content, :param, :image

  def param
    "#{id}-#{title}"
  end
end
