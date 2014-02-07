#Sorting any 'nil' fields

  unless @raform.booking_id.nil? || @raform.booking_id === 0
  else
  	@raform.booking_id = 0
  end
 unless @raform.particulars.nil? || @raform.particulars === 0
 else
 	@raform.particulars = ""
 end
  unless @raform.equipment.nil? || @raform.equipment === 0
  else
  	@raform.equipment = ""
  end
  unless @raform.complex.nil? || @raform.complex === 0
  else
  	@raform.complex = false
  end
 unless @raform.company_name.nil? || @raform.company_name === 0
 else
 	@raform.company_name = ""
 end
  unless @raform.conducted_by.nil? || @raform.conducted_by === 0
  else
  	@raform.conducted_by = ""
  end
  unless @raform.signature.nil? || @raform.signature === 0
  else
  	@raform.signature = ""
  end
 unless @raform.date.nil? || @raform.date === 0
 else
 	@raform.date = ""
 end
 unless @raform.verified.nil? || @raform.verified === 0
 else
 	@raform.verified = false
 end
  unless @raform.complete.nil? || @raform.complete === 0
  else
  	@raform.complete = false
  end
  unless @raform.progress.nil? || @raform.progress === 0
  else
  	@raform.progress = 0
  end

prawn_document() do |pdf|

	pdf.fill_color "777777"
	pdf.text 'Risk Assessment: Livestock Event 2014 (Booking #' << @booking.id.to_s << ')', :align => :center

  
  pdf.move_up 25
  pdf.fill_color "000000"
  pdf.text @booking.id.to_s, :align => :right, :size => 40, :style => :bold

  pdf.move_up 45
  pdf.fill_color "000000"
  pdf.text 'RA', :align => :left, :size => 40, :style => :bold


  pdf.define_grid(:columns => 12, :rows => 12, :gutter => 30)
  pdf.grid([1,0], [2,5]).bounding_box do
  		# color => black
  		pdf.fill_color "333333"
 	pdf.text "Brief outline of exhibit: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
  	
  	pdf.fill_color "ff0000"
  	pdf.text @raform.particulars, :align => :right, :color => "FF0000"
  end
  pdf.grid([1,7], [2,11]).bounding_box do
  		# color => black
  		pdf.fill_color "333333"
 	pdf.text "Equipment to be used: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
  	
  	pdf.fill_color "ff0000"
  	pdf.text @raform.equipment, :align => :right, :color => "FF0000"
  end

         pdf.grid([2,0], [3,5]).bounding_box do
            # color => black
            pdf.fill_color "333333"
          pdf.text "Complex Structure: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
          if @raform.complex
            pdf.stroke do
             pdf.rectangle [120,95], 10, 10
             pdf.fill_circle [125, 90], 2
             pdf.fill_color "ff0000"
            end
          else
            pdf.stroke do
              pdf.rectangle [120,95], 10, 10
            end
          end
         end

   pdf.grid([3,0], [4,5]).bounding_box do
   		# color => black
   		pdf.fill_color "333333"
  	pdf.text "Company Name: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
  	
  	pdf.fill_color "ff0000"
  	pdf.text @raform.company_name, :align => :right, :color => "FF0000"
   end
   
    pdf.grid([3,7], [4,11]).bounding_box do
        # color => black
        pdf.fill_color "333333"
    pdf.text "Conducted by: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
    
    pdf.fill_color "ff0000"
    pdf.text @raform.conducted_by, :align => :right, :color => "FF0000"
    end

     pdf.grid([4,0], [5,5]).bounding_box do
        # color => black
        pdf.fill_color "333333"
      pdf.text "Signature: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
      
      pdf.fill_color "ff0000"
      pdf.text @raform.signature, :align => :right, :color => "FF0000"
     end
     
      pdf.grid([4,7], [5,11]).bounding_box do
          # color => black
          pdf.fill_color "333333"
      pdf.text "Date: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
      
      pdf.fill_color "ff0000"
      pdf.text @raform.date, :align => :right, :color => "FF0000"
      end

      pdf.grid([5,0], [6,2]).bounding_box do
         # color => black
         pdf.fill_color "333333"
       pdf.text "Hazard/Risk", :align => :center, :size => 10, :style => :bold, :color => "#AAAAAA"
      end
      
       pdf.grid([5,2], [6,4]).bounding_box do
           # color => black
           pdf.fill_color "333333"
       pdf.text "Persons at Risk", :align => :center, :size => 10, :style => :bold, :color => "#AAAAAA"
       end

       pdf.grid([5,4], [6,6]).bounding_box do
           # color => black
           pdf.fill_color "333333"
       pdf.text "Risk Level", :align => :center, :size => 10, :style => :bold, :color => "#AAAAAA"
       end

       pdf.grid([5,6], [6,8]).bounding_box do
           # color => black
           pdf.fill_color "333333"
       pdf.text "Association of Risk", :align => :center, :size => 10, :style => :bold, :color => "#AAAAAA"
       end

       pdf.grid([5,8], [6,11]).bounding_box do
           # color => black
           pdf.fill_color "333333"
       pdf.text "Controls to Minimise Risk", :align => :center, :size => 10, :style => :bold, :color => "#AAAAAA"
       end

       #set counter to increment rows manually

       i = 6

       @hazards.each do |hazard|

       #NIL hazards

       unless hazard.name.nil? || hazard.name === 0
       else
         hazard.name = "No name given"
       end
        unless hazard.persons.nil? || hazard.persons === 0
        else
         hazard.persons = "No persons given"
        end
        unless hazard.level.nil? || hazard.level === 0
        else
         hazard.level = "n/a"
        end
        unless hazard.rassociation.nil? || hazard.rassociation === 0
        else
         hazard.rassociation = "n/a"
        end
        unless hazard.controls.nil? || hazard.controls === 0
        else
         hazard.controls = "No Controls given"
        end

       pdf.grid([i,0], [i+1,2]).bounding_box do
          # color => black
          pdf.fill_color "ff0000"
        pdf.text hazard.name, :align => :center, :size => 10, :color => "#FF0000"
       end
       
        pdf.grid([i,2], [i+1,4]).bounding_box do
            # color => black
            pdf.fill_color "ff0000"
        pdf.text hazard.persons, :align => :center, :size => 10, :color => "#FF0000"
        end

        pdf.grid([i,4], [i+1,6]).bounding_box do
            # color => black
            pdf.fill_color "ff0000"
        pdf.text hazard.level, :align => :center, :size => 10, :color => "#FF0000"
        end

        pdf.grid([i,6], [i+1,8]).bounding_box do
            # color => black
            pdf.fill_color "ff0000"
        pdf.text hazard.rassociation, :align => :center, :size => 10, :color => "#FF0000"
        end

        pdf.grid([i,8], [i+1,11]).bounding_box do
            # color => black
            pdf.fill_color "ff0000"
        pdf.text hazard.controls, :align => :center, :size => 10, :color => "#FF0000"
        end

        i += 1

       end
    
end