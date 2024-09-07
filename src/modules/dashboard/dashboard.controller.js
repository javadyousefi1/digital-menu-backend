const Controller = require('../../common/controllers/controller');
const { orderModel } = require('../order/order.model');
const createError = require("http-errors");
const { paginate, buildSearchQuery } = require('../../utils/helpers');
const dayjs = require('dayjs');
const jalaliday = require('jalaliday'); // Correct plugin

dayjs.extend(jalaliday); // Extend dayjs with jalaliday

class DashboardController extends Controller {
    #orderModel
    constructor() {
        super()
        this.#orderModel = orderModel
    }

    async monthReportOfIncome(req, res, next) {
        try {
            // Get the first day of the current month in Jalali and format it to ISO string
            const startDayOfCurrentMonthJalali = dayjs().calendar('jalali').startOf('month').toISOString();
            const endDayOfCurrentMonthJalali = dayjs().calendar('jalali').endOf('month').add(1, "day").toISOString();

            const query = {
                $gte: `${startDayOfCurrentMonthJalali.slice(0, 11)}23:59:59.000Z`,
                $lte: `${endDayOfCurrentMonthJalali.slice(0, 11)}23:59:59.000Z`,
            }

            const result = await this.#orderModel.find({ createdAt: query }).select('+createdAt');;
            const inThisMonthUntilNow = result.reduce((acc, curr) => acc = acc + curr.totalPrice, 0)


            const data = [...result]

            let array = []


            data.forEach(item => {
                item.order.forEach(innerItem => {
                    const createdAt = new Date(String(item.createdAt)).toISOString().split('T')[0]
                    const alreadyExisted = array.find(existingItem => existingItem.date === createdAt);

                    if (alreadyExisted) {
                        const price = (innerItem.offPrice > 0 ? innerItem.offPrice : innerItem.price) * innerItem.count;
                        alreadyExisted.price += price;
                    } else {
                        const price = (innerItem.offPrice > 0 ? innerItem.offPrice : innerItem.price) * innerItem.count;

                        const newRecord = {
                            date: createdAt,
                            price
                        };

                        array.push(newRecord);
                    }
                });
            });


            const mostDayIncomeInCurrentMonth = array.sort((a, b) => b.price - a.price)[0]


            const statistics = {
                inThisMonthUntilNow,
                mostDayIncomeInCurrentMonth
            }


            res.json(statistics);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = { DashboardController: new DashboardController() };
