#Sorting any 'nil' fields

  unless @hsform.booking_id.nil? || @hsform.booking_id === 0
  else
  	@hsform.booking_id = 0
  end
 unless @hsform.particulars.nil? || @hsform.particulars === 0
 else
 	@hsform.particulars = ""
 end
  unless @hsform.mobile.nil? || @hsform.mobile === 0
  else
  	@hsform.mobile = ""
  end
  unless @hsform.policy.nil? || @hsform.policy === 0
  else
  	@hsform.policy = false
  end
 unless @hsform.company_name.nil? || @hsform.company_name === 0
 else
 	@hsform.company_name = ""
 end

 unless @hsform.name.nil? || @hsform.name === 0
 else
  @hsform.name = ""
 end
  unless @hsform.completed_by.nil? || @hsform.completed_by === 0
  else
  	@hsform.completed_by = ""
  end
 unless @hsform.date.nil? || @hsform.date === 0
 else
 	@hsform.date = ""
 end
 unless @hsform.verified.nil? || @hsform.verified === 0
 else
 	@hsform.verified = false
 end
  unless @hsform.complete.nil? || @hsform.complete === 0
  else
  	@hsform.complete = false
  end
  unless @hsform.progress.nil? || @hsform.progress === 0
  else
  	@hsform.progress = 0
  end

  unless @hsform.public_insurance.nil? || @hsform.public_insurance === 0
  else
    @hsform.public_insurance = false
  end

  unless @hsform.employee_insurance.nil? || @hsform.employee_insurance === 0
  else
    @hsform.employee_insurance = false
  end

  unless @hsform.tick_1.nil? || @hsform.tick_1 === 0
  else
    @hsform.tick_1 = false
  end

  unless @hsform.tick_2.nil? || @hsform.tick_2 === 0
  else
    @hsform.tick_2 = false
  end

  unless @hsform.tick_3.nil? || @hsform.tick_3 === 0
  else
    @hsform.tick_3 = false
  end

  unless @hsform.tick_4.nil? || @hsform.tick_4 === 0
  else
    @hsform.tick_4 = false
  end

  unless @hsform.tick_5.nil? || @hsform.tick_5 === 0
  else
    @hsform.tick_5 = false
  end

  unless @hsform.tick_6.nil? || @hsform.tick_6 === 0
  else
    @hsform.tick_6 = false
  end

  unless @hsform.tick_7.nil? || @hsform.tick_7 === 0
  else
    @hsform.tick_7 = false
  end

  unless @hsform.agreed.nil? || @hsform.agreed === 0
  else
    @hsform.agreed = false
  end

prawn_document() do |pdf|

	pdf.fill_color "777777"
	pdf.text 'Health & Safety: Livestock Event 2014 (Booking #' << @booking.id.to_s << ')', :align => :center

  
  pdf.move_up 25
  pdf.fill_color "000000"
  pdf.text @booking.id.to_s, :align => :right, :size => 40, :style => :bold

  pdf.move_up 45
  pdf.fill_color "000000"
  pdf.text 'HS', :align => :left, :size => 40, :style => :bold


  pdf.define_grid(:columns => 12, :rows => 12, :gutter => 30)
  pdf.grid([1,0], [2,3]).bounding_box do
  		# color => black
  		pdf.fill_color "333333"
 	pdf.text "Company Name: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
  	
  	pdf.fill_color "ff0000"
  	pdf.text @hsform.company_name, :align => :center, :color => "FF0000"
  end

   pdf.grid([1,3], [2,7]).bounding_box do
      # color => black
      pdf.fill_color "333333"
    pdf.text "Contact Name: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
    
    pdf.fill_color "ff0000"
    pdf.text @hsform.name, :align => :center, :color => "FF0000"
   end

  pdf.grid([1,7], [2,11]).bounding_box do
  		# color => black
  		pdf.fill_color "333333"
 	pdf.text "Mobile Phone: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
  	
  	pdf.fill_color "ff0000"
  	pdf.text @hsform.mobile, :align => :center, :color => "FF0000"
  end

   pdf.grid([2,0], [4,11]).bounding_box do
      # color => black
      pdf.fill_color "333333"
    pdf.text "Nature of Exhibit: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
    
    pdf.fill_color "ff0000"
    pdf.text @hsform.particulars, :align => :right, :color => "FF0000"
   end

         pdf.grid([4,0], [5,4]).bounding_box do
            # color => black
            pdf.fill_color "333333"
          pdf.text "Own H&S Policy? ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
          if @hsform.policy
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

         pdf.grid([4,4], [5,8]).bounding_box do
            # color => black
            pdf.fill_color "333333"
          pdf.text "Public Liability Insurance? ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
          if @hsform.public_insurance
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

         pdf.grid([4,8], [5,11]).bounding_box do
            # color => black
            pdf.fill_color "333333"
          pdf.text "Employee Liability Insurance? ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
          if @hsform.employee_insurance
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

         #TICKS

         pdf.grid([5,0], [6,5]).bounding_box do
            # color => black
            pdf.fill_color "333333"
          pdf.text "Complies with Clause 16: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
          if @hsform.tick_1
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

         pdf.grid([5,6], [6,11]).bounding_box do
            # color => black
            pdf.fill_color "333333"
          pdf.text "No significant risks: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
          if @hsform.tick_2
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

         pdf.grid([6,0], [7,5]).bounding_box do
            # color => black
            pdf.fill_color "333333"
          pdf.text "No changes to previous assessment: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
          if @hsform.tick_3
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
          pdf.text "Staff informed of potential risks: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
          if @hsform.tick_4
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
          pdf.text "Staff informed of risks: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
          if @hsform.tick_5
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
          pdf.text "Received Assessments from Contractors: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
          if @hsform.tick_6
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
          pdf.text "Previously prosecuted? ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
          if @hsform.tick_7
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
          pdf.text "Agreement Waiver: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
          if @hsform.agreed
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
    pdf.text "Completed by: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
    
    pdf.fill_color "ff0000"
    pdf.text @hsform.completed_by, :align => :right, :color => "FF0000"
    end
     
      pdf.grid([9,6], [10,11]).bounding_box do
          # color => black
          pdf.fill_color "333333"
      pdf.text "Date: ", :align => :left, :size => 10, :style => :italic, :color => "#AAAAAA"
      
      pdf.fill_color "ff0000"
      pdf.text @hsform.date, :align => :right, :color => "FF0000"
      end

end