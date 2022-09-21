<script>
    export let component
    export let compIndex
    export let selectionField
    function handleClick(){
        selectionField = compIndex.toString();
    }
</script>

<div class="comp-card">
    <img class="comp-image" src={component.img} alt="" />
    <p class="comp-name">{component.name}</p>
    <div class="comp-descr">{component.descr}</div>
    <div class="detail-field">
        <button on:click={handleClick} class="btn btn-blue">Select</button>
    </div>
    <!-- <div class="comp-details">
      <div
        class="detail-field price-change"
        class:positive={changeIsPositive(1.0)}
      >
        {environment.expiryTime}
      </div>
      <div class="detail-field">
        <form action="/sites/delete" method="post">
            <input type="hidden" name="name" value="{environment.name}">
            <button type="submit" class="btn btn-sm btn-danger">Delete</button>
        </form>    
      </div>
      <a class="detail-field" href="http://{environment.name}.westeurope.azurecontainer.io:8888/lab">Environment webpage &#8594;</a>
    </div> -->
</div>

<style>
  .comp-card {
    /* display: flex;
    align-items: center;
    justify-content: space-around;
    grid-template-columns: 1fr 1fr 1fr 1fr; */
    /* background: url('Squares-Red.png'); */
    /* background-color: rgba(158, 145, 145, 0.418); */
    padding: 20px;
    max-width: 14rem;
    border: 1px solid;
    border-color: lightgrey;
    border-radius: 10px;
    --tw-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }

  .comp-image {
    max-width: 4rem;
  }

  .comp-name {
    font-size: 20px;
    font-weight: bold;
    margin: -2px 0 -2px 0;
    /* margin-top: 15px; */
  }
  .comp-descr {

  }

  .comp-details {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    /* border-top: 1px solid #d1d5db; */
    background-color: #f3f4f6;
  }

  .detail-field {
    font-size: 15px;
    font-weight: bold;
    margin: -2px 0 -20px -20px;
  }

  .detail-field:not(:last-child) {
    border-right: 1px solid #d1d5db;
  }

  .btn {
    font-size: 15px;
    border-radius: 5px;
  }
  .btn-blue {
    border-color: #1875df;
    background-color: #1875df;
    color: #ffffff;
  }

  .price-change {
    color: #dc2626;
  }

  .positive {
    color: #16a34a;
  }

  @media (min-width: 1024px) {
    .detail-field {
      font-size: 18px;
      padding: 15px;
    }
  }
</style>