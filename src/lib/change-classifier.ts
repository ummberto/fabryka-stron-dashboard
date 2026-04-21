export type ChangeClassification = {
  request_type: string;
  change_class: 'quick_edit' | 'content_edit' | 'structural_edit' | 'design_edit';
  requires_ai: boolean;
  requires_preview: boolean;
  publish_mode:
    | 'instant_rebuild'
    | 'draft_then_publish'
    | 'preview_then_publish'
    | 'scheduled_publish';
};

const QUICK_EDIT_TYPES = [
  'change_phone',
  'change_email',
  'change_hours',
  'change_cta_url',
  'change_social_links',
];

const CONTENT_EDIT_TYPES = [
  'rewrite_service_section',
  'add_faq',
  'rewrite_about',
  'rewrite_contact',
  'update_reviews',
];

const STRUCTURAL_EDIT_TYPES = [
  'add_service',
  'add_location',
  'change_slug',
  'create_page',
  'remove_service',
];

const DESIGN_EDIT_TYPES = [
  'redesign_homepage',
  'change_visual_profile',
  'change_section_variant',
  'change_template_family',
];

export function classifyChangeRequest(requestType: string): ChangeClassification {
  if (QUICK_EDIT_TYPES.includes(requestType)) {
    return {
      request_type: requestType,
      change_class: 'quick_edit',
      requires_ai: false,
      requires_preview: false,
      publish_mode: 'instant_rebuild',
    };
  }

  if (CONTENT_EDIT_TYPES.includes(requestType)) {
    return {
      request_type: requestType,
      change_class: 'content_edit',
      requires_ai: true,
      requires_preview: false,
      publish_mode: 'draft_then_publish',
    };
  }

  if (STRUCTURAL_EDIT_TYPES.includes(requestType)) {
    return {
      request_type: requestType,
      change_class: 'structural_edit',
      requires_ai: true,
      requires_preview: true,
      publish_mode: 'preview_then_publish',
    };
  }

  if (DESIGN_EDIT_TYPES.includes(requestType)) {
    return {
      request_type: requestType,
      change_class: 'design_edit',
      requires_ai: false,
      requires_preview: true,
      publish_mode: 'preview_then_publish',
    };
  }

  return {
    request_type: requestType,
    change_class: 'structural_edit',
    requires_ai: true,
    requires_preview: true,
    publish_mode: 'preview_then_publish',
  };
}