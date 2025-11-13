export const ROLE_CONFIGS = {
  parent: {
    id: 'parent',
    title: 'Parent',
    icon: '👤',
    accentClass: 'text-teal-300',
    gradientClass: 'from-teal-500/60 to-emerald-500/40',
    login: {
      heading: 'Parent Login',
      subheading:
        'Use your registered email to review reports, track progress, and stay informed.',
      identifierLabel: 'Email address',
      identifierPlaceholder: 'parent@example.com',
    },
    register: {
      heading: 'Parent Registration',
      subheading:
        'Complete the form to activate your Shield 360 parent dashboard.',
      emailLabel: 'Email address',
      emailPlaceholder: 'parent@example.com',
      extraFields: [
        {
          name: 'contactNumber',
          label: 'Contact number',
          type: 'tel',
          autoComplete: 'tel',
          placeholder: '+91 98765 43210',
        },
        {
          name: 'childName',
          label: 'Child’s name',
          type: 'text',
          autoComplete: 'name',
          placeholder: 'Enter your child’s name',
        },
      ],
    },
  },
  child: {
    id: 'child',
    title: 'Child',
    icon: '🧒',
    accentClass: 'text-sky-300',
    gradientClass: 'from-sky-500/60 to-indigo-500/40',
    login: {
      heading: 'Child Login',
      subheading:
        'Enter your learner ID to continue personalised learning and support.',
      identifierLabel: 'Learner ID or email',
      identifierPlaceholder: 'e.g. S360-CH-001 or child@example.com',
    },
    register: {
      heading: 'Child Registration',
      subheading:
        'Safely onboard to Shield 360 with guidance from your guardian or teacher.',
      emailLabel: 'Guardian email',
      emailPlaceholder: 'guardian@example.com',
      extraFields: [
        {
          name: 'guardianName',
          label: 'Guardian’s name',
          type: 'text',
          autoComplete: 'name',
          placeholder: 'Enter guardian’s full name',
        },
        {
          name: 'grade',
          label: 'Class / Grade',
          type: 'text',
          autoComplete: 'off',
          placeholder: 'e.g. Grade 6',
        },
      ],
    },
  },
  teacher: {
    id: 'teacher',
    title: 'Teacher',
    icon: '🧑‍🏫',
    accentClass: 'text-amber-300',
    gradientClass: 'from-amber-500/60 to-orange-500/40',
    login: {
      heading: 'Teacher Login',
      subheading:
        'Enter your registered email or staff ID to manage classroom safety workflows.',
      identifierLabel: 'Email or staff ID',
      identifierPlaceholder: 'teacher@example.com',
    },
    register: {
      heading: 'Teacher Registration',
      subheading:
        'Create your teacher workspace to access reporting tools and resources.',
      emailLabel: 'Official email',
      emailPlaceholder: 'teacher@example.com',
      extraFields: [
        {
          name: 'schoolName',
          label: 'School / Institution',
          type: 'text',
          autoComplete: 'organization',
          placeholder: 'Enter school name',
        },
        {
          name: 'employeeId',
          label: 'Employee ID',
          type: 'text',
          autoComplete: 'off',
          placeholder: 'e.g. TCHR-1024',
        },
      ],
    },
  },
}

export function resolveRoleConfig(roleId) {
  return ROLE_CONFIGS[roleId]
}


