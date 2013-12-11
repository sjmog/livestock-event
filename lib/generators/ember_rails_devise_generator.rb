class EmberRailsDeviseGenerator < Rails::Generators::Base
  desc "This generator creates models, associated controllers, and views for Ember through a handy GUI."
  def create_initializer_file
    create_file "config/initializers/initializer.rb", "# Add initialization content here"
  end
end