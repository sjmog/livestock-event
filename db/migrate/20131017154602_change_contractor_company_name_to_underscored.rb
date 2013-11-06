class ChangeContractorCompanyNameToUnderscored < ActiveRecord::Migration
  def up
  	rename_column :contractors, :companyName, :company_name
  end

  def down
  	rename_column :contractors, :company_name, :companyName
  end
end
