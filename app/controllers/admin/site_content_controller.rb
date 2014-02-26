module Admin
  class SiteContentController < BaseController
    layout "admin"
    load_and_authorize_resource
    actions :fetch, :booking, :registration, :livestock, :accommodation, :awards, :tickets, :contractor, :welcome, :whatson, :whyexhibit, :whyvisit, :lastyear, :general, :update

    def fetch
      @site_content = SiteContent.find(1)
      path = params[:name]
      render path
    end

    def edit
      @site_content = SiteContent.find(1)
    end

    def update
      @site_content = SiteContent.find(1)
      
      if @site_content.update(params[:site_content])
        flash[:success] = "Site Content updated."
        redirect_to admin_main_path
      else
        flash[:error] = "There was an error updating content. Please try again."
        redirect_to admin_main_path
      end
    end

    protected

      def permitted_params
        params.permit(:site_content => [:id, :livestock_results_notices_charolais, :livestock_results_notices_dairy, :livestock_results_notices_bb, :livestock_results_notices_aa, :livestock_results_notices_lleyn, :livestock_results_about, :booking_show_forms_pp_url, :booking_show_forms_lm_url, :booking_show_forms_eg_internal_url, :booking_show_forms_eg_external_url, :booking_show_forms_nec_url, :booking_show_forms_alcohol_url, :booking_show_forms_food_url, :booking_start, :registration_sponsor_icon, :registration_sponsor_text, :registration_help, :cattle_tb, :livestock_contact_name, :livestock_contact_org, :livestock_contact_street, :livestock_contact_locality, :livestock_contact_region, :livestock_contact_postcode, :livestock_contact_country, :livestock_nlsc_info, :accommodation_one, :accommodation_one_about, :accommodation_two, :accommodation_two_about, :awards_one_name, :awards_one_about, :awards_one_lastyear, :awards_one_lastyear_image_url, :awards_one_conditions, :awards_two_name, :awards_two_about, :awards_two_lastyear, :awards_two_lastyear_image_url, :awards_two_conditions, :why_one_title, :why_one_text, :why_two_title, :why_three_title, :why_four_title, :why_two_text, :why_three_text, :why_four_text, :contractors_buildup, :contractors_breakdown, :exhibiting_text, :main_phone, :main_email, :main_address, :main_errata, :last_year_text, :cookie_info, :livestock_about_nds, :livestock_about_charolais, :livestock_about_bb, :livestock_about_aa, :livestock_about_lleyn, :livestock_about_all, :tickets_text, :whyvisit_text, :welcome_title, :welcome_one_label, :welcome_two_label, :welcome_three_label, :welcome_four_label, :welcome_five_label, :welcome_six_label, :welcome_one_icon, :welcome_two_icon, :welcome_three_icon, :welcome_four_icon, :welcome_five_icon, :welcome_six_icon, :welcome_one_text, :welcome_two_header, :welcome_three_header, :welcome_four_header, :welcome_five_header, :welcome_six_header, :welcome_two_text, :welcome_three_text, :welcome_four_text, :welcome_five_text, :welcome_six_text, :whatson_ah_text, :whatson_bm_text, :whatson_dr_text, :whatson_ff_text, :whatson_genetics_text, :whatson_hs_text, :whatson_lem_text, :whatson_mh_text, :whatson_ml_text, :whatson_mm_text, :whatson_si_text, :whatson_farmsec_text, :whatson_forfield_text, :whatson_pigpoult_text, :whatson_lameprev_text, :whatson_foottrim_text, :whatson_export_text, :whatson_careers_text, :whatson_dairypro_text, :whatson_nds_text, :whatson_ncs_text, :whatson_nbbs_text, :whatson_nlsc_text, :whatson_societies_text, :whatson_naas_text, :whatson_busdebates_text, :whatson_farmhealth_text, :whatson_feedsci_text, :whatson_fourfour_text, :whatson_utv_text])
      end
    private

    # Strong Parameters (Rails four)
    def site_content_params
      params.require(:site_content).permit(:id, :livestock_results_notices_charolais, :livestock_results_notices_dairy, :livestock_results_notices_bb, :livestock_results_notices_aa, :livestock_results_notices_lleyn, :livestock_results_about, :booking_show_forms_pp_url, :booking_show_forms_lm_url, :booking_show_forms_eg_internal_url, :booking_show_forms_eg_external_url, :booking_show_forms_nec_url, :booking_show_forms_alcohol_url, :booking_show_forms_food_url, :booking_start, :registration_sponsor_icon, :registration_sponsor_text, :registration_help, :cattle_tb, :livestock_contact_name, :livestock_contact_org, :livestock_contact_street, :livestock_contact_locality, :livestock_contact_region, :livestock_contact_postcode, :livestock_contact_country, :livestock_nlsc_info, :accommodation_one, :accommodation_one_about, :accommodation_two, :accommodation_two_about, :awards_one_name, :awards_one_about, :awards_one_lastyear, :awards_one_lastyear_image_url, :awards_one_conditions, :awards_two_name, :awards_two_about, :awards_two_lastyear, :awards_two_lastyear_image_url, :awards_two_conditions, :why_one_title, :why_one_text, :why_two_title, :why_three_title, :why_four_title, :why_two_text, :why_three_text, :why_four_text, :contractors_buildup, :contractors_breakdown, :exhibiting_text, :main_phone, :main_email, :main_address, :main_errata, :last_year_text, :cookie_info, :livestock_about_nds, :livestock_about_charolais, :livestock_about_bb, :livestock_about_aa, :livestock_about_lleyn, :livestock_about_all, :tickets_text, :whyvisit_text, :welcome_title, :welcome_one_label, :welcome_two_label, :welcome_three_label, :welcome_four_label, :welcome_five_label, :welcome_six_label, :welcome_one_icon, :welcome_two_icon, :welcome_three_icon, :welcome_four_icon, :welcome_five_icon, :welcome_six_icon, :welcome_one_text, :welcome_two_header, :welcome_three_header, :welcome_four_header, :welcome_five_header, :welcome_six_header, :welcome_two_text, :welcome_three_text, :welcome_four_text, :welcome_five_text, :welcome_six_text, :whatson_ah_text, :whatson_bm_text, :whatson_dr_text, :whatson_ff_text, :whatson_genetics_text, :whatson_hs_text, :whatson_lem_text, :whatson_mh_text, :whatson_ml_text, :whatson_mm_text, :whatson_si_text, :whatson_farmsec_text, :whatson_forfield_text, :whatson_pigpoult_text, :whatson_lameprev_text, :whatson_foottrim_text, :whatson_export_text, :whatson_careers_text, :whatson_dairypro_text, :whatson_nds_text, :whatson_ncs_text, :whatson_nbbs_text, :whatson_nlsc_text, :whatson_societies_text, :whatson_naas_text, :whatson_busdebates_text, :whatson_farmhealth_text, :whatson_feedsci_text, :whatson_fourfour_text, :whatson_utv_text)
    end
  end
end