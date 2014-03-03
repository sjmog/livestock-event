#Sorting any 'nil' fields

  unless @showform.booking_id.nil? || @showform.booking_id === 0
  else
  	@showform.booking_id = 0
  end
 unless @showform.particulars.nil? || @showform.particulars === 0
 else
 	@showform.particulars = ""
 end
  unless @showform.email.nil? || @showform.email === 0
  else
  	@showform.email = ""
  end
  unless @showform.telephone.nil? || @showform.telephone === 0
  else
  	@showform.telephone = ""
  end
 unless @showform.company_name.nil? || @showform.company_name === 0
 else
 	@showform.company_name = ""
 end
  unless @showform.contact_name.nil? || @showform.contact_name === 0
  else
  	@showform.contact_name = ""
  end
  unless @showform.address.nil? || @showform.address === 0
  else
  	@showform.address = ""
  end
 unless @showform.website.nil? || @showform.website === 0
 else
 	@showform.website = ""
 end
 unless @showform.verified.nil? || @showform.verified === 0
 else
 	@showform.verified = false
 end
  unless @showform.complete.nil? || @showform.complete === 0
  else
  	@showform.complete = false
  end
  unless @showform.progress.nil? || @showform.progress === 0
  else
  	@showform.progress = 0
  end

  unless @showform.dairy.nil? || @showform.dairy === 0
  else
    @showform.dairy = false
  end

  unless @showform.beef.nil? || @showform.beef === 0
  else
    @showform.beef = false
  end

  unless @showform.sheep.nil? || @showform.sheep === 0
  else
    @showform.sheep = false
  end

  unless @showform.goats.nil? || @showform.goats === 0
  else
    @showform.goats = false
  end

  unless @showform.pigs.nil? || @showform.pigs === 0
  else
    @showform.pigs = false
  end

  unless @showform.poultry.nil? || @showform.poultry === 0
  else
    @showform.poultry = false
  end

  unless @showform.arable.nil? || @showform.arable === 0
  else
    @showform.arable = false
  end

prawn_document() do |pdf|

	pdf.fill_color "777777"
	pdf.text 'Show Guide Entry: Livestock Event 2014 (Booking #' << @booking.id.to_s << ')', :align => :center

  
  pdf.move_up 25
  pdf.fill_color "000000"
  pdf.text @booking.id.to_s, :align => :right, :size => 40, :style => :bold

  pdf.move_up 45
  pdf.fill_color "000000"
  pdf.text 'SG', :align => :left, :size => 40, :style => :bold


  pdf.define_grid(:columns => 12, :rows => 12, :gutter => 30)
  pdf.grid([1,0], [2,5]).bounding_box do
  		# color => black
  		pdf.fill_color "333333"
 	pdf.text "Company or Brand name: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
  	
  	pdf.fill_color "ff0000"
  	pdf.text @showform.company_name, :align => :right, :color => "FF0000"
  end
  pdf.grid([1,7], [2,11]).bounding_box do
  		# color => black
  		pdf.fill_color "333333"
 	pdf.text "Contact name: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
  	
  	pdf.fill_color "ff0000"
  	pdf.text @showform.contact_name, :align => :right, :color => "FF0000"
  end

   pdf.grid([2,0], [3,11]).bounding_box do
   		# color => black
   		pdf.fill_color "333333"
  	pdf.text "Address: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
  	
  	pdf.fill_color "ff0000"
  	pdf.text @showform.address, :align => :right, :color => "FF0000"
   end
   
    pdf.grid([3,0], [4,6]).bounding_box do
        # color => black
        pdf.fill_color "333333"
    pdf.text "Email: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
    
    pdf.fill_color "ff0000"
    pdf.text @showform.email, :align => :right, :color => "FF0000"
    end

     pdf.grid([3,7], [4,11]).bounding_box do
        # color => black
        pdf.fill_color "333333"
      pdf.text "Website: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
      
      pdf.fill_color "ff0000"
      pdf.text @showform.website, :align => :right, :color => "FF0000"
     end


     pdf.grid([4,0], [5,11]).bounding_box do
        # color => black
        pdf.fill_color "333333"
      pdf.text "Telephone: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
      
      pdf.fill_color "ff0000"
      pdf.text @showform.telephone, :align => :right, :color => "FF0000"
     end



     
      pdf.grid([5,0], [6,11]).bounding_box do
          # color => black
          pdf.fill_color "333333"
      pdf.text "Description of company (max 25 words): ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
      
      pdf.fill_color "ff0000"
      pdf.text @showform.particulars, :align => :right, :color => "FF0000"
      end

      pdf.grid([6,0], [7,5]).bounding_box do
         # color => black
         pdf.fill_color "333333"
       pdf.text "Dairy: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
       if @showform.dairy
         pdf.stroke do
          pdf.rectangle [10,70], 10, 10
          pdf.fill_circle [15, 65], 2
          pdf.fill_color "333333"
         end
       else
         pdf.stroke do
           pdf.rectangle [10,70], 10, 10
         end
       end
      end

      pdf.grid([6,6], [7,11]).bounding_box do
         # color => black
         pdf.fill_color "333333"
       pdf.text "Beef: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
       if @showform.beef
         pdf.stroke do
          pdf.rectangle [10,70], 10, 10
          pdf.fill_circle [15, 65], 2
          pdf.fill_color "333333"
         end
       else
         pdf.stroke do
           pdf.rectangle [10,70], 10, 10
         end
       end
      end

      pdf.grid([7,0], [8,5]).bounding_box do
         # color => black
         pdf.fill_color "333333"
       pdf.text "Sheep: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
       if @showform.sheep
         pdf.stroke do
          pdf.rectangle [10,70], 10, 10
          pdf.fill_circle [15, 65], 2
          pdf.fill_color "333333"
         end
       else
         pdf.stroke do
           pdf.rectangle [10,70], 10, 10
         end
       end
      end

      pdf.grid([7,6], [8,11]).bounding_box do
         # color => black
         pdf.fill_color "333333"
       pdf.text "Goats: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
       if @showform.goats
         pdf.stroke do
          pdf.rectangle [10,70], 10, 10
          pdf.fill_circle [15, 65], 2
          pdf.fill_color "333333"
         end
       else
         pdf.stroke do
           pdf.rectangle [10,70], 10, 10
         end
       end
      end

      pdf.grid([8,0], [9,5]).bounding_box do
         # color => black
         pdf.fill_color "333333"
       pdf.text "Pigs: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
       if @showform.pigs
         pdf.stroke do
          pdf.rectangle [10,70], 10, 10
          pdf.fill_circle [15, 65], 2
          pdf.fill_color "333333"
         end
       else
         pdf.stroke do
           pdf.rectangle [10,70], 10, 10
         end
       end
      end

      pdf.grid([8,6], [9,11]).bounding_box do
         # color => black
         pdf.fill_color "333333"
       pdf.text "Poultry: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
       if @showform.poultry
         pdf.stroke do
          pdf.rectangle [10,70], 10, 10
          pdf.fill_circle [15, 65], 2
          pdf.fill_color "333333"
         end
       else
         pdf.stroke do
           pdf.rectangle [10,70], 10, 10
         end
       end
      end

      pdf.grid([9,0], [10,5]).bounding_box do
         # color => black
         pdf.fill_color "333333"
       pdf.text "Arable ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
       if @showform.arable
         pdf.stroke do
          pdf.rectangle [10,70], 10, 10
          pdf.fill_circle [15, 65], 2
          pdf.fill_color "333333"
         end
       else
         pdf.stroke do
           pdf.rectangle [10,70], 10, 10
         end
       end
      end

      
    
end