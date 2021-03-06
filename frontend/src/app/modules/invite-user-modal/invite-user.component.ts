import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {OpModalLocalsMap} from 'core-app/modules/modal/modal.types';
import {OpModalComponent} from 'core-app/modules/modal/modal.component';
import {OpModalLocalsToken} from "core-app/modules/modal/modal.service";
import {APIV3Service} from "core-app/modules/apiv3/api-v3.service";
import {RoleResource} from "core-app/modules/hal/resources/role-resource";

enum Steps {
  ProjectSelection,
  Principal,
  Role,
  Message,
  Summary,
  Success,
}

export enum PrincipalType {
  User = 'user',
  Placeholder = 'placeholder',
  Group = 'group',
}

@Component({
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InviteUserModalComponent extends OpModalComponent implements OnInit {
  public Steps = Steps;
  public step = Steps.ProjectSelection;

  /* Close on escape? */
  public closeOnEscape = true;

  /* Close on outside click */
  public closeOnOutsideClick = true;

  /* Data that is retured from the modal on close */
  public data:any = null;

  public type:PrincipalType|null = null;
  public project:any = null;
  public principal = null;
  public role:RoleResource|null = null;
  public message = '';

  constructor(
    @Inject(OpModalLocalsToken) public locals:OpModalLocalsMap,
    readonly cdRef:ChangeDetectorRef,
    readonly elementRef:ElementRef,
    readonly apiV3Service:APIV3Service,
  ) {
    super(locals, cdRef, elementRef);
  }

  ngOnInit() {
    super.ngOnInit();

    if (this.locals.projectId) {
      this.apiV3Service.projects.id(this.locals.projectId).get().subscribe(data => {
        this.project = data;
      });
    }
  }

  onProjectSelectionSave({ type, project }:{ type:PrincipalType, project:any }) {
    this.type = type;
    this.project = project;
    this.goTo(Steps.Principal);
  }

  onPrincipalSave({ principal, isAlreadyMember }:{ principal:any, isAlreadyMember:boolean }) {
    this.principal = principal;
    if (isAlreadyMember) {
      return this.closeWithPrincipal();
    }

    this.goTo(Steps.Role);
  }

  onRoleSave(role:RoleResource) {
    this.role = role;

    if (this.type === 'placeholder') {
      this.goTo(Steps.Summary);
    } else {
      this.goTo(Steps.Message);
    }
  }

  onMessageSave({ message }:{ message:string }) {
    this.message = message;
    this.goTo(Steps.Summary);
  }

  goTo(step:Steps) {
    this.step = step;
  }

  closeWithPrincipal() {
    this.data = this.principal;
    this.closeMe();
  }
}
