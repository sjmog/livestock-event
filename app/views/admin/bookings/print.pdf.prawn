
def stand_format(booking)
	if booking.stand_type === "clear"
		return "Clear"
	elsif booking.stand_type === "modular"
		return "Shell Scheme"
	else return "Error: undeclared stand format"
	end		
end

def stand_type(booking)
	if booking.position === "standard"
		return "Standard"
	elsif booking.position === "corner"
		return "Corner"
	elsif booking.position === "peninsula"
		return "Peninsula"
	elsif booking.position === "island"
		return "Island"
	else return "Error: undeclared stand type"
	end		
end

#Sorting any 'nil' fields

  unless @booking.company_name.nil? || @booking.company_name === 0
  else
  	@booking.company_name === ""
  end
 unless @booking.corporate_membership.nil? || @booking.corporate_membership === 0
 else
 	@booking.corporate_membership === false
 end
  unless @booking.correspondence_address.nil? || @booking.correspondence_address === 0
  else
  	@booking.correspondence_address === ""
  end
  unless @booking.invoice_address.nil? || @booking.invoice_address === 0
  else
  	@booking.invoice_address === ""
  end
 unless @booking.tc_agreed.nil? || @booking.tc_agreed === 0
 else
 	@booking.tc_agreed === false
 end
  unless @booking.show_area.nil? || @booking.show_area === 0
  else
  	@booking.show_area === ""
  end
  unless @booking.stand_type.nil? || @booking.stand_type === 0
  else
  	@booking.stand_type === ""
  end
 unless @booking.frontage.nil? || @booking.frontage === 0
 else
 	@booking.frontage === ""
 end
 unless @booking.depth.nil? || @booking.depth === 0
 else
 	@booking.depth === ""
 end
  unless @booking.position.nil? || @booking.position === 0
  else
  	@booking.position === ""
  end
  unless @booking.breed_society.nil? || @booking.breed_society === 0
  else
  	@booking.breed_society === ""
  end
  unless @booking.zone.nil? || @booking.zone === 0
  else
  	@booking.zone === ""
  end
 unless @booking.requires_leaflets.nil? || @booking.requires_leaflets === 0
 else
 	@booking.requires_leaflets === false
 end
 unless @booking.number_leaflets.nil? || @booking.number_leaflets === 0
 else
 	@booking.number_leaflets === ""
 end
 unless @booking.pdf_leaflet.nil? || @booking.pdf_leaflet === 0
 else
 	@booking.pdf_leaflet === false
 end
 unless @booking.machinery_motion.nil? || @booking.machinery_motion === 0
 else
 	@booking.machinery_motion === false
 end
 unless @booking.mobile_unit.nil? || @booking.mobile_unit === 0
 else
 	@booking.mobile_unit === false
 end
 unless @booking.livestock_stand.nil? || @booking.livestock_stand === 0
 else
 	@booking.livestock_stand === false
 end
 unless @booking.new_products.nil? || @booking.new_products === 0
 else
 	@booking.new_products === false
 end
 unless @booking.philip_award.nil? || @booking.philip_award === 0
 else
 	@booking.philip_award === false
 end
 unless @booking.livestock_award.nil? || @booking.livestock_award === 0
 else
 	@booking.livestock_award === false
 end
 unless @booking.exports.nil? || @booking.exports === 0
 else
 	@booking.exports === false
 end
 unless @booking.exhibitor_list.nil? || @booking.exhibitor_list === 0
 else
 	@booking.exhibitor_list === false
 end
  unless @booking.contact_name.nil? || @booking.contact_name === 0
  else
  	@booking.contact_name === ""
  end
  unless @booking.telephone.nil? || @booking.telephone === 0
  else
  	@booking.telephone === ""
  end
  unless @booking.email.nil? || @booking.email === 0
  else
  	@booking.email === ""
  end
  unless @booking.exhibiting_name.nil? || @booking.exhibiting_name === 0
  else
  	@booking.exhibiting_name === ""
  end
  unless @booking.po_number.nil? || @booking.po_number === 0
  else
  	@booking.po_number === ""
  end
  unless @booking.finance_contact.nil? || @booking.finance_contact === 0
  else
  	@booking.finance_contact === ""
  end
  unless @booking.finance_telephone.nil? || @booking.finance_telephone === 0
  else
  	@booking.finance_telephone === ""
  end
  unless @booking.contractor_company_name.nil? || @booking.contractor_company_name === 0
  else
  	@booking.contractor_company_name === ""
  end
 unless @booking.contractor_address.nil? || @booking.contractor_address === 0
 else
 	@booking.contractor_address === ""
 end
  unless @booking.contractor_telephone.nil? || @booking.contractor_telephone === 0
  else
  	@booking.contractor_telephone === ""
  end
  unless @booking.contractor_email.nil? || @booking.contractor_email === 0
  else
  	@booking.contractor_email === ""
  end
  unless @booking.contractor_contact_name.nil? || @booking.contractor_contact_name === 0
  else
  	@booking.contractor_contact_name === ""
  end
 unless @booking.placements.nil? || @booking.placements === 0
 else
 	@booking.placements === false
 end
  unless @booking.stand_number.nil? || @booking.stand_number === 0
  else
  	@booking.stand_number === ""
  end
 unless @booking.requirements.nil? || @booking.requirements === 0
 else
 	@booking.requirements === ""
 end

prawn_document() do |pdf|


  pdf.define_grid(:columns => 12, :rows => 19, :gutter => 30)
  pdf.grid([0,0], [1,5]).bounding_box do
 	pdf.text "Company Name: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
  	pdf.move_up 10
  	pdf.text @booking.company_name, :align => :right
  end
  pdf.grid([0,7], [1,11]).bounding_box do
 	pdf.text "Contact Name: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
  	pdf.move_up 10
  	pdf.text @booking.contact_name, :align => :right
  end

   pdf.grid([1,0], [2,5]).bounding_box do
  	pdf.text "Exhibiting Name: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
  	pdf.move_up 10
  	pdf.text @booking.exhibiting_name, :align => :right
   end
   pdf.grid([1,7], [2,11]).bounding_box do
  	
   end


     pdf.grid([2,0], [3,5]).bounding_box do
    	pdf.text "Contact Tel. No.: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
     	pdf.move_up 10
     	pdf.text @booking.telephone, :align => :right
     end
     pdf.grid([2,7], [3,11]).bounding_box do
    	pdf.text "Contact Email: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
     	pdf.move_up 10
     	pdf.text @booking.email, :align => :right
     end

      pdf.grid([3,0], [5,11]).bounding_box do
     	pdf.text "Correspondence Address: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
      	pdf.move_up 10
      	pdf.text @booking.correspondence_address, :align => :center
      end
      

       pdf.grid([5,0], [6,5]).bounding_box do
      	pdf.text "Corporate Membership: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
      	if @booking.corporate_membership
	       	pdf.stroke do
	       	 pdf.rectangle [120,50], 10, 10
	       	 pdf.fill_ellipse [124, 54], 3
	       	end
	    else
	    	pdf.stroke do
	    	 pdf.rectangle [120,50], 10, 10
	    	end
	    end
       end
       pdf.grid([5,7], [6,11]).bounding_box do
      	pdf.text "TC Agreed: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
       	if @booking.tc_agreed
       		       	pdf.stroke do
       		       	 pdf.rectangle [120,50], 10, 10
       		       	 
       		       	end
       		       	pdf.fill_circle [125, 45], 2
       		    else
       		    	pdf.stroke do
       		    	 pdf.rectangle [120,50], 10, 10
       		    	end
       		    end
       end

        pdf.grid([6,0], [8,11]).bounding_box do

       	pdf.text "Invoice Address: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
        	pdf.move_up 10
        	unless @booking.invoice_address.nil? || @booking.invoice_address === 0
        		pdf.text @booking.invoice_address, :align => :center
        	end
        end
        

         pdf.grid([8,0], [9,5]).bounding_box do
        	pdf.text "Finance Contact: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
         	pdf.move_up 10
         	pdf.text @booking.finance_contact, :align => :right
         end
         pdf.grid([8,7], [9,11]).bounding_box do
        	pdf.text "Tel.: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
         	pdf.move_up 10
         	pdf.text @booking.finance_telephone, :align => :right
         end

           pdf.grid([9,0], [10,5]).bounding_box do
          	pdf.text "Block/Stand No.: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
           	pdf.move_up 10
           	pdf.text @booking.stand_number, :align => :right
           end
           pdf.grid([9,7], [10,11]).bounding_box do
          	
           end

            pdf.grid([10,0], [11,3]).bounding_box do
           	pdf.text "Do you require leaflets? ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
           	
            	if @booking.requires_leaflets
            		       	pdf.stroke do
            		       	 pdf.rectangle [120,50], 10, 10
            		       	 
            		       	end
            		       	pdf.fill_circle [125, 45], 2
            		    else
            		    	pdf.stroke do
            		    	 pdf.rectangle [120,50], 10, 10
            		    	end
            		    end

            end
            pdf.grid([10,4], [11,7]).bounding_box do
           		pdf.text "No. Leaflets ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
           	 	pdf.move_up 10
           	 	pdf.text @booking.number_leaflets.to_s, :align => :center
           	 
            end
            
            pdf.grid([10,8], [11,11]).bounding_box do
           			pdf.text "PDF? ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
           		 	
           		 	if @booking.pdf_leaflet
           		 		       	pdf.stroke do
           		 		       	 pdf.rectangle [120,50], 10, 10
           		 		       	 
           		 		       	end
           		 		       	pdf.fill_circle [125, 45], 2
           		 		    else
           		 		    	pdf.stroke do
           		 		    	 pdf.rectangle [120,50], 10, 10
           		 		    	end
           		 		    end
           		
            end

             pdf.grid([11,0], [12,3]).bounding_box do
            	pdf.text "Exhibiting Machinery ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
            	
             	if @booking.machinery_motion
             	       		       	pdf.stroke do
             	       		       	 pdf.rectangle [120,50], 10, 10
             	       		       	 
             	       		       	end
             	       		       	pdf.fill_circle [125, 45], 2
             	       		    else
             	       		    	pdf.stroke do
             	       		    	 pdf.rectangle [120,50], 10, 10
             	       		    	end
             	       		    end

             end
             pdf.grid([11,4], [12,7]).bounding_box do
            		pdf.text "Bring a Mobile Unit ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
            	
             	if @booking.mobile_unit
             		       	pdf.stroke do
             		       	 pdf.rectangle [120,50], 10, 10
             		       	 
             		       	end
             		       	pdf.fill_circle [125, 45], 2
             		    else
             		    	pdf.stroke do
             		    	 pdf.rectangle [120,50], 10, 10
             		    	end
             		    end
            	 
             end
             
             pdf.grid([11,8], [12,11]).bounding_box do
            			pdf.text "Exhibiting Livestock ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
            		 	
            		 	if @booking.livestock_stand
            		 		       	pdf.stroke do
            		 		       	 pdf.rectangle [120,50], 10, 10
            		 		       	 
            		 		       	end
            		 		       	pdf.fill_circle [125, 45], 2
            		 		    else
            		 		    	pdf.stroke do
            		 		    	 pdf.rectangle [120,50], 10, 10
            		 		    	end
            		 		    end
            		
             end

              pdf.grid([12,0], [13,3]).bounding_box do
             	pdf.text "New Products ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
             	
              	if @booking.new_products
              		       	pdf.stroke do
              		       	 pdf.rectangle [120,50], 10, 10
              		       	 
              		       	end
              		       	pdf.fill_circle [125, 45], 2
              		    else
              		    	pdf.stroke do
              		    	 pdf.rectangle [120,50], 10, 10
              		    	end
              		    end

              end
              pdf.grid([12,4], [13,7]).bounding_box do
             		pdf.text "Prince Philip Award ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
             	
              	if @booking.philip_award
              		       	pdf.stroke do
              		       	 pdf.rectangle [120,50], 10, 10
              		       	 
              		       	end
              		       	pdf.fill_circle [125, 45], 2
              		    else
              		    	pdf.stroke do
              		    	 pdf.rectangle [120,50], 10, 10
              		    	end
              		    end
             	 
              end
              
              pdf.grid([12,8], [13,11]).bounding_box do
             			pdf.text "Livestock M & E ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
             		 	
             		 	if @booking.livestock_award
             		 		       	pdf.stroke do
             		 		       	 pdf.rectangle [120,50], 10, 10
             		 		       	 
             		 		       	end
             		 		       	pdf.fill_circle [125, 45], 2
             		 		    else
             		 		    	pdf.stroke do
             		 		    	 pdf.rectangle [120,50], 10, 10
             		 		    	end
             		 		    end
             		
              end

               pdf.grid([13,0], [14,3]).bounding_box do
              	pdf.text "Export from UK ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
              	
               	if @booking.exports
               		       	pdf.stroke do
               		       	 pdf.rectangle [120,50], 10, 10
               		       	 
               		       	end
               		       	pdf.fill_circle [125, 45], 2
               		    else
               		    	pdf.stroke do
               		    	 pdf.rectangle [120,50], 10, 10
               		    	end
               		    end

               end
               pdf.grid([13,4], [14,7]).bounding_box do
              		pdf.text "Work Placements ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
              	
               	if @booking.placements
               		       	pdf.stroke do
               		       	 pdf.rectangle [120,50], 10, 10
               		       	 
               		       	end
               		       	pdf.fill_circle [125, 45], 2
               		    else
               		    	pdf.stroke do
               		    	 pdf.rectangle [120,50], 10, 10
               		    	end
               		    end
              	 
               end
               
               pdf.grid([13,8], [14,11]).bounding_box do
              			
              		
               end

                pdf.grid([14,0], [15,3]).bounding_box do
               	pdf.text "Exhibitor List ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
               	
                	if @booking.exhibitor_list
                		       	pdf.stroke do
                		       	 pdf.rectangle [120,50], 10, 10
                		       	 
                		       	end
                		       	pdf.fill_circle [125, 45], 2
                		    else
                		    	pdf.stroke do
                		    	 pdf.rectangle [120,50], 10, 10
                		    	end
                		    end

                end
                pdf.grid([14,4], [15,7]).bounding_box do
               		
               	 
                end
                
                pdf.grid([14,8], [15,11]).bounding_box do
               			
               		
                end

                 pdf.grid([15,0], [16,5]).bounding_box do
                	pdf.text "Contractor Company Name ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                	pdf.move_up 10
                 	pdf.text @booking.contractor_company_name, :align => :right

                 end
                  pdf.grid([15,6], [16,11]).bounding_box do
                 		pdf.text "Contact: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                 	 	pdf.move_up 10
                 	 	pdf.text @booking.contractor_contact_name, :align => :right

                  end

             pdf.grid([16,0], [17,5]).bounding_box do
            		pdf.text "Email: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
            	 	pdf.move_up 10
            	 	pdf.text @booking.contractor_email, :align => :right
             end
             pdf.grid([16,7], [17,11]).bounding_box do
            		pdf.text "Tel.: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
            	 	pdf.move_up 10
            	 	pdf.text @booking.contractor_telephone, :align => :right
             end

             

               pdf.grid([17,0], [19,11]).bounding_box do
              	pdf.text "Contractor Address ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
              	pdf.move_up 10
               	pdf.text @booking.contractor_address, :align => :center

               end

               pdf.start_new_page

               #second page

                pdf.grid([0,0], [3,11]).bounding_box do
               	pdf.text "Requirements ", :align => :left, :size => 10, :style => :bold, :color => "#AAAAAA"
               		pdf.move_down 12
                	pdf.text @booking.requirements, :align => :left

                end

                 pdf.grid([3,0], [5,5]).bounding_box do
                 	
                	pdf.text "Invoice Address: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                 	pdf.move_up 10
                 	pdf.text @booking.invoice_address, :align => :right
                 end
                 pdf.grid([3,7], [5,11]).bounding_box do
                	pdf.text "P.O. No.: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                 	pdf.move_up 10
                 	pdf.text @booking.po_number, :align => :right
                 end

                  pdf.grid([5,0], [6,5]).bounding_box do
                 	pdf.text "Stand Frontage: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                  	pdf.move_up 10
                  	pdf.text @booking.frontage.to_s, :align => :right
                  end
                  pdf.grid([5,7], [6,11]).bounding_box do
                 	pdf.text "Stand Depth: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                  	pdf.move_up 10
                  	pdf.text @booking.depth.to_s, :align => :right
                  end

                   pdf.grid([6,0], [7,5]).bounding_box do
                  	pdf.text "Show Area: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                   	pdf.move_up 10
                   	pdf.text @booking.show_area, :align => :right
                   end
                   pdf.grid([6,7], [7,11]).bounding_box do
                  	pdf.text "Zone: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                   	pdf.move_up 10
                   	pdf.text @booking.zone, :align => :right
                   end

                    pdf.grid([7,0], [8,5]).bounding_box do
                   	pdf.text "Stand Format: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                    	pdf.move_up 10
                    	pdf.text stand_format(@booking), :align => :right
                    end
                    pdf.grid([7,7], [8,11]).bounding_box do
                   	pdf.text "Stand Type: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                    	pdf.move_up 10
                    	pdf.text stand_type(@booking), :align => :right
                    end

                     pdf.grid([8,0], [9,5]).bounding_box do
                    	pdf.text "Mobile Unit ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                     	if @booking.mobile_unit
                     		       	pdf.stroke do
                     		       	 pdf.rectangle [120,50], 10, 10
                     		       	 
                     		       	end
                     		       	pdf.fill_circle [125, 45], 2
                     		    else
                     		    	pdf.stroke do
                     		    	 pdf.rectangle [120,50], 10, 10
                     		    	end
                     		    end
                     end
                     pdf.grid([8,7], [9,11]).bounding_box do
                    	pdf.text "Leaflets Qty: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                     	pdf.move_up 10
                     	pdf.text @booking.number_leaflets.to_s, :align => :right
                     end

                      pdf.grid([9,0], [10,11]).bounding_box do
                     	pdf.text "Stand Costs ", :align => :left, :size => 14, :style => :bold, :color => "#AAAAAA"
                     	
                      	

                      end

                       pdf.grid([10,0], [11,11]).bounding_box do
                      	pdf.text "Base Price: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                      	
                       	pdf.text number_to_currency(@base_price, locale: :en, unit: "£"), :align => :center

                       end

                        pdf.grid([11,0], [12,11]).bounding_box do
                       	pdf.text "Surcharge for Stand Type: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                       	
                        	pdf.text number_to_currency(@surcharge, locale: :en, unit: "£"), :align => :center

                        end

                         pdf.grid([12,0], [13,11]).bounding_box do
                        	pdf.text "Subtotal (Ex VAT): ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                        	
                         	pdf.text number_to_currency(@total_price, locale: :en, unit: "£"), :align => :center

                         end

                          pdf.grid([13,0], [15,11]).bounding_box do
                         	pdf.text "Total: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                         	
                          	pdf.text number_to_currency(@total_price_vat, locale: :en, unit: "£"), :align => :center, :size => 18

                          end

                           pdf.grid([15,0], [16,5]).bounding_box do
                          	pdf.text "30% Deposit Ex VAT: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                           	pdf.move_up 10
                           	pdf.text number_to_currency(@deposit_ex_vat, locale: :en, unit: "£"), :align => :right
                           end
                           pdf.grid([15,7], [16,11]).bounding_box do
                          	pdf.text "30% Deposit Inc VAT: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
                           	pdf.move_up 10
                           	pdf.text number_to_currency(@deposit_inc_vat, locale: :en, unit: "£"), :align => :right
                           end
end