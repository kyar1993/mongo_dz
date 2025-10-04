// генерируем список моделей
// хранилище ids экземпляров, чтобы в будущем нагенерить складкие остатки
// сохраняем _id's в бд, чтобы использовать при генерации складких остатков
const carBrands = ["Hyundai", "Mazda", "BMW", "Mercedes", "Audi", "Honda", "Toyota"];
const engineTypes = ["diesel", "petrol"];
const engineVolumes = ["1.6", "2.0", "2.5", "3.0"];

const generatedCarIds = [];

for (let i = 0; i < 10; i++) {
    const randomBrand = carBrands[Math.floor(Math.random() * carBrands.length)];
    const randomEngine = engineTypes[Math.floor(Math.random() * engineTypes.length)];
    const randomVolume = engineVolumes[Math.floor(Math.random() * engineVolumes.length)];
    const randomPrice = 10000 + Math.floor(Math.random() * 50000);

    db.cars.insertOne({
        _id: ObjectId(),
        name: "model" + i,
        brand: randomBrand,
        category: "cars",
        engine: randomEngine,
        engineVolume: randomVolume,
        price: randomPrice,
        sku: randomBrand.toUpperCase().substring(0, 3) + "-MODEL" + i
    });

    // сохраняем _id в массив _id's
    generatedCarIds.push(result.insertedId);
}

db.car_ids.insertOne({
    name: "generated_car_ids",
    ids: generatedCarIds,
    createdAt: new Date(),
    totalCount: generatedCarIds.length
});

db.cars.find()

// получаем сохраненные _id's автомобилей
// генерируем остатки авто на складах
const carIds = db.car_ids.findOne(
    {name: "generated_car_ids"}
).ids;

const warehouses = [
    {
        name: "Основной склад Мск",
        address: "Москва, ул. Заводская, 1",
        stocks: []
    },
    {
        name: "Склад СПб",
        address: "Санкт-Петербург, ул. Заводская, 2",
        stocks: []
    },
    {
        name: "Склад Екб",
        address: "Екатеринбург, ул. Заводская, 3",
        stocks: []
    }
];

warehouses.forEach(warehouse => {
    carIds.forEach(carId => {
        const randomQuantity = Math.floor(Math.random() * 5) + 1;

        warehouse.stocks.push({
            productId: carId,
            quantity: randomQuantity,
        });
    });
});

const result = db.warehouses.insertMany(warehouses);

db.warehouses.find()

// 1. mapreduce
function map(){
    this.stocks.forEach(function(stock){
        emit(stock.productId.toString(), stock.quantity);
    });
}

function reduce(key, values){
    return Array.sum(values);
}

db.warehouses.mapReduce(map, reduce, {out: "product_totals"});
db.product_totals.find();

// 2. реализовать на aggregation framework
db.warehouses.aggregate([
    { $unwind: "$stocks" },
    {
        $group: {
            _id: "$stocks.productId",
            totalQuantity: { $sum: "$stocks.quantity" }
        }
    },
    {
        $lookup: {
            from: "cars",
            localField: "_id",
            foreignField: "_id",
            as: "carInfo"
        }
    },
    {
        $project: {
            productId: "$_id",
            totalQuantity: 1,
            name: { $arrayElemAt: ["$carInfo.name", 0] }
        }
    }
])