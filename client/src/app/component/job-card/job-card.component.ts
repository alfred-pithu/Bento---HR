import { Component, Input } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiClientService } from '../../services/apiClient/api-client.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.css'
})
export class JobCardComponent {
  @Input() card: any;
  @Input() isSliced: boolean = true;
  @Input() showButton: boolean = true;
  @Input() percentageJob: any;
  isVisible = false;
  isOkLoading = false;
  selectedJobId = 0;
  selectedRestaurantId = 0;
  applicantId = 0;
  applicantData: any;

  toggleCardDetails(card: any): void {
    card.showDetails = !card.showDetails;
  }

  showModal(jobId: number, restaurantId: number): void {
    if (this.applicantId === 0) {
      this.router.navigate(['/signup']);
    } else {
      this.isVisible = true;
      this.selectedJobId = jobId;
      this.selectedRestaurantId = restaurantId;
    }

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.applicantId = +params['applicantId'] || 0;
    });
  }

  handleOk(): void {
    const applicantId = this.applicantId;
    this.apiClientService.applyJob(this.selectedJobId, this.selectedRestaurantId, applicantId).subscribe(
      (response) => {
        this.modalService.success({
          nzTitle: 'Success',
          nzContent: 'Application submitted successfully.',
        });
      },
      (error) => {
        console.error('Error submitting application:', error);
        this.modalService.error({
          nzTitle: 'Error',
          nzContent: 'Error submitting application. Please try again.',
        });
      }
    );


    this.isOkLoading = true;

    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);

  }

  handleCancel(): void {
    this.isVisible = false;
  }

  formatSkills(skillsStringArray: string[]): string[] {
    const skillsArray = skillsStringArray.flatMap(skillString => skillString.split(','));
    return skillsArray;
  }

  constructor(private router: Router, private route: ActivatedRoute, private apiClientService: ApiClientService, private modalService: NzModalService) { }

}
