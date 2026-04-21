# Schema Snapshot — Supabase (public)

Pobrano: 2026-04-20

## clients
| kolumna | typ |
|---|---|
| id | string (uuid) |
| company_name | string |
| industry | string |
| status | string |
| created_at | string (timestamptz) |
| updated_at | string (timestamptz) |

## site_config
| kolumna | typ |
|---|---|
| id | string (uuid) |
| client_id | string (uuid) |
| site_name | string |
| domain | string |
| phone | string |
| email | string |
| address | string |
| city | string |
| template_family | string |
| template_version | string |
| cta_url | string |
| facebook_url | string |
| instagram_url | string |
| primary_color | string |
| secondary_color | string |
| logo_url | string |
| created_at | string (timestamptz) |
| updated_at | string (timestamptz) |

## services
| kolumna | typ |
|---|---|
| id | string (uuid) |
| client_id | string (uuid) |
| name | string |
| slug | string |
| short_description | string |
| is_active | boolean |
| sort_order | integer |
| created_at | string (timestamptz) |
| updated_at | string (timestamptz) |

## service_versions
| kolumna | typ |
|---|---|
| id | string (uuid) |
| service_id | string (uuid) |
| version_no | integer |
| status | string |
| full_description | string |
| metadata | jsonb |
| source | string |
| approved_at | string (timestamptz) |
| published_at | string (timestamptz) |
| created_at | string (timestamptz) |

## pages
| kolumna | typ |
|---|---|
| id | string (uuid) |
| client_id | string (uuid) |
| slug | string |
| title | string |
| body_markdown | string |
| meta_title | string |
| meta_description | string |
| is_active | boolean |
| created_at | string (timestamptz) |
| updated_at | string (timestamptz) |

## page_versions
| kolumna | typ |
|---|---|
| id | string (uuid) |
| page_id | string (uuid) |
| version_no | integer |
| status | string |
| body_markdown | string |
| metadata | jsonb |
| source | string |
| approved_at | string (timestamptz) |
| published_at | string (timestamptz) |
| created_at | string (timestamptz) |

## locations
| kolumna | typ |
|---|---|
| id | string (uuid) |
| client_id | string (uuid) |
| city | string |
| slug | string |
| region | string |
| is_main | boolean |
| is_active | boolean |
| created_at | string (timestamptz) |
| updated_at | string (timestamptz) |

## location_versions
| kolumna | typ |
|---|---|
| id | string (uuid) |
| location_id | string (uuid) |
| version_no | integer |
| status | string |
| description | string |
| metadata | jsonb |
| source | string |
| approved_at | string (timestamptz) |
| published_at | string (timestamptz) |
| created_at | string (timestamptz) |

## client_posts
| kolumna | typ |
|---|---|
| id | string (uuid) |
| client_id | string (uuid) |
| slug | string |
| title | string |
| body_markdown | string |
| status | string |
| published_at | string (timestamptz) |
| created_at | string (timestamptz) |
| updated_at | string (timestamptz) |

## post_versions
| kolumna | typ |
|---|---|
| id | string (uuid) |
| post_id | string (uuid) |
| version_no | integer |
| status | string |
| body_markdown | string |
| metadata | jsonb |
| source | string |
| approved_at | string (timestamptz) |
| published_at | string (timestamptz) |
| created_at | string (timestamptz) |

## change_requests
| kolumna | typ |
|---|---|
| id | string (uuid) |
| client_id | string (uuid) |
| request_type | string |
| change_class | string |
| target_table | string |
| target_record_id | string (uuid) |
| requires_ai | boolean |
| requires_preview | boolean |
| priority | string |
| status | string |
| requested_text | string |
| publish_mode | string |
| created_at | string (timestamptz) |
| updated_at | string (timestamptz) |

## jobs
| kolumna | typ |
|---|---|
| id | string (uuid) |
| client_id | string (uuid) |
| request_id | string (uuid) |
| job_type | string |
| trigger_source | string |
| payload_json | jsonb |
| status | string |
| progress | integer |
| result_json | jsonb |
| error_message | string |
| started_at | string (timestamptz) |
| finished_at | string (timestamptz) |
| created_at | string (timestamptz) |

## job_steps
| kolumna | typ |
|---|---|
| id | string (uuid) |
| job_id | string (uuid) |
| step_name | string |
| status | string |
| output_json | jsonb |
| error_message | string |
| started_at | string (timestamptz) |
| finished_at | string (timestamptz) |
| created_at | string (timestamptz) |

## deployments
| kolumna | typ |
|---|---|
| id | string (uuid) |
| client_id | string (uuid) |
| snapshot_id | string (uuid) |
| type | string |
| status | string |
| deploy_url | string |
| created_at | string (timestamptz) |

## deployment_snapshots
| kolumna | typ |
|---|---|
| id | string (uuid) |
| client_id | string (uuid) |
| snapshot_json | jsonb |
| template_version | string |
| created_at | string (timestamptz) |

## indexing_events
| kolumna | typ |
|---|---|
| id | string (uuid) |
| deployment_id | string (uuid) |
| url | string |
| status | string |
| response | jsonb |
| created_at | string (timestamptz) |

## asset_library
| kolumna | typ |
|---|---|
| id | string (uuid) |
| client_id | string (uuid) |
| type | string |
| storage_path | string |
| alt_text | string |
| title | string |
| created_at | string (timestamptz) |

## design_profiles
| kolumna | typ |
|---|---|
| id | string (uuid) |
| client_id | string (uuid) |
| template_family | string |
| font_pair | string |
| cta_style | string |
| section_rhythm | string |
| radius_style | string |
| motion_level | string |
| imagery_style | string |
| created_at | string (timestamptz) |
| updated_at | string (timestamptz) |

## page_section_variants
| kolumna | typ |
|---|---|
| id | string (uuid) |
| client_id | string (uuid) |
| route | string |
| section_key | string |
| variant_key | string |
| created_at | string (timestamptz) |

## system_logs
| kolumna | typ |
|---|---|
| id | string (uuid) |
| client_id | string (uuid) |
| log_type | string |
| message | string |
| payload_json | jsonb |
| created_at | string (timestamptz) |

## content_diffs
| kolumna | typ |
|---|---|
| id | string (uuid) |
| request_id | string (uuid) |
| before_json | jsonb |
| after_json | jsonb |
| diff_summary | string |
| created_at | string (timestamptz) |

## content
| kolumna | typ |
|---|---|
| id | string (uuid) |

---

*Uwaga: typ `jsonb` w TypeScript reprezentowany jako `Record<string, unknown>`. Wszystkie pola nullable oznaczone jako `| null` w types/database.ts.*
