import { Injectable, Logger } from '@nestjs/common';

export interface Tutorial {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  transcript: string;
  videoUrl?: string;
}

@Injectable()
export class TutorialsService {
  private readonly logger = new Logger(TutorialsService.name);

  // Mock data — in production, would come from a database
  private tutorials: Tutorial[] = [
    {
      id: 1,
      title: 'Quick Start: Create Your First Transport',
      description:
        'Learn the basic steps to create your first transport in the system.',
      duration: '6 min',
      category: 'Getting Started',
      transcript:
        'Step 1: Click in "Transports" in the side menu.\nStep 2: Click in "New Transport".\nStep 3: Fill in the origin, destination and cargo details.\nStep 4: Select an available vehicle.\nStep 5: Click "Create" to confirm.',
      videoUrl: 'https://example.com/video1.mp4',
    },
    {
      id: 2,
      title: 'Set Up Real-Time Tracking',
      description:
        'Follow this guide to enable and monitor transports in real time.',
      duration: '8 min',
      category: 'Tracking',
      transcript:
        'Real-time tracking uses GPS to monitor vehicle position.\nStep 1: Go to "Tracking and Route Optimization".\nStep 2: Select a transport in transit.\nStep 3: View the real-time map with updates every 5 seconds.\nStep 4: Use the filters to refine the view.',
      videoUrl: 'https://example.com/video2.mp4',
    },
    {
      id: 3,
      title: 'Basic Route Optimization',
      description:
        'Discover how to optimize routes for better efficiency and cost savings.',
      duration: '10 min',
      category: 'Optimization',
      transcript:
        'Route optimization reduces travel time and fuel consumption.\nStep 1: Access the "Tracking" section.\nStep 2: Select multiple delivery points.\nStep 3: Click "Optimize Route".\nStep 4: Compare the suggested routes with the original.\nStep 5: Apply the best option.',
      videoUrl: 'https://example.com/video3.mp4',
    },
    {
      id: 4,
      title: 'Managing Multiple Tenants',
      description: 'For Super Admins: set up and manage multiple companies.',
      duration: '12 min',
      category: 'Admin',
      transcript:
        'In a multi-tenant system, each company has its own isolated data.\nStep 1: As a Super Admin, access "Companies".\nStep 2: Click "Create New Company".\nStep 3: Configure the details and permissions.\nStep 4: Assign users to the company.\nStep 5: Each company will have its own dashboard.',
      videoUrl: 'https://example.com/video4.mp4',
    },
    {
      id: 5,
      title: 'Advanced Reports and Analysis',
      description: 'Generate detailed reports and analyze performance metrics.',
      duration: '9 min',
      category: 'Reports',
      transcript:
        'Reports help you understand patterns and improve operations.\nStep 1: Go to the Advanced Dashboard.\nStep 2: Select the analysis period.\nStep 3: Choose the metrics you want to view.\nStep 4: Export the report as PDF.\nStep 5: Share with your team.',
      videoUrl: 'https://example.com/video5.mp4',
    },
  ];

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const total = this.tutorials.length;
    const totalPages = Math.ceil(total / limit);

    const tutorials = this.tutorials.slice(skip, skip + limit);

    this.logger.log(
      `📚 GET /tutorials - Page: ${page}, Limit: ${limit}, Total: ${total}`,
    );

    return {
      data: tutorials,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: number) {
    const tutorial = this.tutorials.find((t) => t.id === id);

    if (!tutorial) {
      this.logger.warn(`📚 GET /tutorials/${id} - Not found`);
      return null;
    }

    this.logger.log(`📚 GET /tutorials/${id} - Found`);
    return tutorial;
  }

  async findByCategory(category: string, page: number = 1, limit: number = 10) {
    const filtered = this.tutorials.filter(
      (t) => t.category.toLowerCase() === category.toLowerCase(),
    );
    const skip = (page - 1) * limit;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);

    const tutorials = filtered.slice(skip, skip + limit);

    this.logger.log(
      `📚 GET /tutorials/category/${category} - Found ${total} tutorials`,
    );

    return {
      data: tutorials,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }
}
