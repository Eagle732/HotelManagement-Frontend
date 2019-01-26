import { Component, OnInit } from '@angular/core';
import { DISHES } from '../shared/dishes';
import { Dish } from '../shared/dish';
import { COMMENTS } from '../shared/comments';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {

    dish:Dish;
    dishIds: string[];
    prev: string;
    next: string;
    errMess: string;
    dishcopy: Dish;
    comments: Comment[] = COMMENTS;
    comment: string;

  constructor(private dishService: DishService,
      private route: ActivatedRoute,
      private location: Location) { }

      ngOnInit() {
          let id = this.route.snapshot.params['id'];
          this.dishService.getDish(id)
          .subscribe(dish => this.dish = dish,
           errmess => this.errMess = <any>errmess);

          this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds, errmess => this.errMess = <any>errmess);
          this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
          .subscribe(dish =>{ this.dish = dish; this.setPrevNext(dish.id); },
           errmess => this.errMess = <any>errmess);
      }

      setPrevNext(dishId: string) {
          const index = this.dishIds.indexOf(dishId);
          this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
          this.next = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      }


      goBack(): void {
          this.location.back();
      }

      onSubmit() {
          this.dishcopy.comments.push(this.comment);
          this.dishService.putDish(this.dishcopy)
          .subscribe(dish => {
              this.dish = dish; this.dishcopy = dish;},
              errmess => {this.dish = null; this.dishcopy = null; this.errMess = <any>errmess;
          });
      }






  }
