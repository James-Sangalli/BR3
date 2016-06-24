exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('BR3').del(),
    // Inserts seed entries, below is example data
    knex('BR3').insert({
     tx: 'a52236a2a48cf44d0168fe9ee1eadf1c44cf32491c51669d3c098cb062adb7b52016',
     value: "0.0024984",
     charityAddress: "16eYNDYgUbR3JJpeQvwMDJowF3MPnSmhpx",
     donorAddress: "3CRr25ymr8Cza1WEfmRmAjSBNhQhADfVfB",
     date:"12 April 2016"
   }),

   knex("payments").insert({value:"0.00227175",
     address:"1Xb8knHbuWkSyaV6E1bnrPMUdQeDnYNbG",
     charity:"38ccq12hPFoiSksxUdr6SQ5VosyjY7s9AU",
     tx:"7b4b29e7639c4939635cd741b906fe30a3fa988f06a5a41c1c2a624dda32ebe9",
     paid:false
   }),

    knex("approvedCharitiesTable").del(),

    knex("approvedCharitiesTable").insert({charityAddress:"38ccq12hPFoiSksxUdr6SQ5VosyjY7s9AU",Charity_Name:"Sean's Outpost"}),
    knex("approvedCharitiesTable").insert({charityAddress:"1HesYJSP1QqcyPEjnQ9vzBL1wujruNGe7R",Charity_Name:"The Water Project"}),
    knex("approvedCharitiesTable").insert({charityAddress:"16Sy8mvjyNgCRYS14m1Rtca3UfrFPzz9e",Charity_Name:"Omni Nano"}),
    knex("approvedCharitiesTable").insert({charityAddress:"1946W6LDsEYF9B5sPYDKfwLw6YBZuHns4",Charity_Name:"Songs Of Love"}),
    knex("approvedCharitiesTable").insert({charityAddress:"1PC9aZC4hNX2rmmrt7uHTfYAS3hRbph4UN",Charity_Name:"Free Software Foundation"}),
    knex("approvedCharitiesTable").insert({charityAddress:"1PAt5oKQGBRigFDY6fB2WgQTtQJNzFyTDr",Charity_Name:"Watsi"}),
    knex("approvedCharitiesTable").insert({charityAddress:"1NgiUwkhYVYMy3eoMC9dHcvdHejGxcuaWm",Charity_Name:"Tor Project"}),
    knex("approvedCharitiesTable").insert({charityAddress:"1M87hiTAa49enJKVeT9gzLjYmJoYh9V98",Charity_Name:"AntiWar"}),
    knex("approvedCharitiesTable").insert({charityAddress:"1CU5YgjquupDw6UeXEyA9VEBH34R7fZ19b",Charity_Name:"TunaPanda"}),
    knex("approvedCharitiesTable").insert({charityAddress:"16DEzKc9fX4XfgGzEvQUJmoYeUrbRNXqxe",Charity_Name:"Chicago Wish Foundation"}),
    knex("approvedCharitiesTable").insert({charityAddress:"1AS3TiTqgJZK6CfNfqcbPXSx4PTFvfghvF",Charity_Name:"Run 2 Rescue"})

  );
};
